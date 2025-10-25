'use client';

import { useEffect, useState } from 'react';
import { DatabaseService } from '@/lib/database';
import { EmergencyRequest, Resource } from '@/types';
import toast from 'react-hot-toast';
import { GlassButton, GlassCard } from '@/components/ui/glass-components';
import { BlurFade } from '@/components/ui/blur-fade';
import { MapPin, Clock, AlertCircle, Package, CheckCircle, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function ResourceMatcher() {
    const [requests, setRequests] = useState<EmergencyRequest[]>([]);
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'ALL' | 'MEDICAL' | 'SHELTER' | 'FOOD' | 'TRANSPORT'>('ALL');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [requestsData, resourcesData] = await Promise.all([
                DatabaseService.listRequests(),
                DatabaseService.listResources()
            ]);
            setRequests(requestsData);
            setResources(resourcesData);
        } catch (error) {
            toast.error('Failed to load data');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMatch = async (request: EmergencyRequest, resource: Resource) => {
        try {
            toast.loading('Creating match...', { id: 'match-loading' });
            await DatabaseService.createMatch(request.id, resource.id);
            toast.success('Successfully matched! Request status updated.', { id: 'match-loading' });
            await loadData();
        } catch (error: any) {
            toast.error(error.message || 'Failed to create match', { id: 'match-loading' });
            console.error('Match error:', error);
        }
    };

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };

    const findMatchingResources = (request: EmergencyRequest) => {
        return resources.filter(resource => 
            resource.type === request.type &&
            resource.availability &&
            calculateDistance(
                request.location.lat,
                request.location.lng,
                resource.location.lat,
                resource.location.lng
            ) <= 25
        ).sort((a, b) => {
            const distA = calculateDistance(request.location.lat, request.location.lng, a.location.lat, a.location.lng);
            const distB = calculateDistance(request.location.lat, request.location.lng, b.location.lat, b.location.lng);
            return distA - distB;
        });
    };

    const filteredRequests = filter === 'ALL' 
        ? requests 
        : requests.filter(r => r.type === filter);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'MEDICAL': return '🏥';
            case 'SHELTER': return '🏠';
            case 'FOOD': return '🍲';
            case 'TRANSPORT': return '🚗';
            default: return '📦';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'HIGH': return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'LOW': return 'bg-green-500/20 text-green-400 border-green-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    if (isLoading) {
        return (
            <GlassCard className="flex justify-center items-center p-12">
                <div className="text-center">
                    <Loader className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading requests and resources...</p>
                </div>
            </GlassCard>
        );
    }

    return (
        <div className="space-y-6">
            <BlurFade>
                <div className="flex flex-wrap gap-2">
                    {(['ALL', 'MEDICAL', 'SHELTER', 'FOOD', 'TRANSPORT'] as const).map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                                filter === type
                                    ? "bg-primary/20 text-primary border-2 border-primary/50"
                                    : "bg-muted/30 text-muted-foreground border-2 border-border/30 hover:border-primary/30"
                            )}
                        >
                            {type === 'ALL' ? '🔍 All' : `${getTypeIcon(type)} ${type}`}
                        </button>
                    ))}
                </div>
            </BlurFade>

            <div className="space-y-4">
                {filteredRequests.length === 0 ? (
                    <GlassCard className="text-center p-12">
                        <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium text-foreground mb-2">No requests found</p>
                        <p className="text-sm text-muted-foreground">Check back later or try a different filter</p>
                    </GlassCard>
                ) : (
                    filteredRequests.map((request, index) => {
                        const matches = findMatchingResources(request);
                        return (
                            <BlurFade key={request.id} delay={index * 0.05}>
                                <GlassCard className="border-l-4 border-primary">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-2xl">{getTypeIcon(request.type)}</span>
                                                <h3 className="text-xl font-bold text-foreground">{request.type}</h3>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                <span className={cn(
                                                    "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border-2",
                                                    getPriorityColor(request.priority)
                                                )}>
                                                    <AlertCircle className="w-3 h-3" />
                                                    {request.priority} PRIORITY
                                                </span>
                                                <span className={cn(
                                                    "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium",
                                                    request.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    request.status === 'MATCHED' ? 'bg-green-500/20 text-green-400' :
                                                    'bg-gray-500/20 text-gray-400'
                                                )}>
                                                    {request.status === 'MATCHED' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                    {request.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-foreground/90 mb-3">{request.description}</p>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                        <MapPin className="w-4 h-4" />
                                        <span>{request.location.address}</span>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-border/50">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-semibold text-foreground flex items-center gap-2">
                                                <Package className="w-4 h-4" />
                                                Available Resources ({matches.length})
                                            </h4>
                                            {matches.length === 0 && (
                                                <span className="text-xs text-muted-foreground">No nearby matches</span>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            {matches.length === 0 ? (
                                                <div className="bg-muted/30 p-4 rounded-xl text-center">
                                                    <p className="text-sm text-muted-foreground">
                                                        No matching resources found within 25km radius
                                                    </p>
                                                </div>
                                            ) : (
                                                matches.map((resource) => {
                                                    const distance = calculateDistance(
                                                        request.location.lat,
                                                        request.location.lng,
                                                        resource.location.lat,
                                                        resource.location.lng
                                                    );
                                                    return (
                                                        <motion.div
                                                            key={resource.id}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-green-500/10 rounded-xl border border-green-500/30"
                                                        >
                                                            <div className="flex-1">
                                                                <p className="font-medium text-foreground">{resource.description}</p>
                                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1 text-sm text-muted-foreground">
                                                                    <span className="flex items-center gap-1">
                                                                        <MapPin className="w-3 h-3" />
                                                                        {resource.location.address}
                                                                    </span>
                                                                    <span className="hidden sm:inline">•</span>
                                                                    <span className="font-medium text-green-400">
                                                                        {distance.toFixed(2)} km away
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <GlassButton
                                                                size="sm"
                                                                onClick={() => handleMatch(request, resource)}
                                                                disabled={request.status === 'MATCHED'}
                                                                contentClassName="flex items-center gap-2"
                                                            >
                                                                {request.status === 'MATCHED' ? (
                                                                    <>
                                                                        <CheckCircle className="w-4 h-4" />
                                                                        Matched
                                                                    </>
                                                                ) : (
                                                                    'Connect'
                                                                )}
                                                            </GlassButton>
                                                        </motion.div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>
                                </GlassCard>
                            </BlurFade>
                        );
                    })
                )}
            </div>
        </div>
    );
}

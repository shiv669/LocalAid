'use client';

import { useEffect, useState } from 'react';
import { DatabaseService } from '@/lib/database';
import { EmergencyRequest, Resource } from '@/types';
import toast from 'react-hot-toast';
import { GlassButton, GlassCard } from '@/components/ui/glass-components';
import { BlurFade } from '@/components/ui/blur-fade';
import { AlertTriangle, Package, MapPin, Navigation, Filter, CheckCircle2, Clock, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ResourceMatcher() {
    const [requests, setRequests] = useState<EmergencyRequest[]>([]);
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterType, setFilterType] = useState<string>('ALL');

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
            await DatabaseService.createMatch(request.id, resource.id);
            toast.success('Successfully matched request with resource!');
            loadData(); // Reload the data
        } catch (error) {
            toast.error('Failed to create match');
            console.error(error);
        }
    };

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Earth's radius in km
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
            ) <= 10 // Within 10km radius
        );
    };

    const typeColors = {
        MEDICAL: 'bg-red-500/20 border-red-500/50 text-red-300',
        SHELTER: 'bg-blue-500/20 border-blue-500/50 text-blue-300',
        FOOD: 'bg-green-500/20 border-green-500/50 text-green-300',
        TRANSPORT: 'bg-purple-500/20 border-purple-500/50 text-purple-300',
    };

    const priorityColors = {
        HIGH: 'bg-red-500/20 border-red-500/50 text-red-300',
        MEDIUM: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300',
        LOW: 'bg-green-500/20 border-green-500/50 text-green-300',
    };

    const statusColors = {
        PENDING: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300',
        MATCHED: 'bg-green-500/20 border-green-500/50 text-green-300',
        COMPLETED: 'bg-blue-500/20 border-blue-500/50 text-blue-300',
        CANCELLED: 'bg-gray-500/20 border-gray-500/50 text-gray-300',
    };

    const typeIcons = {
        MEDICAL: '🏥',
        SHELTER: '🏠',
        FOOD: '🍲',
        TRANSPORT: '🚗',
    };

    const filteredRequests = filterType === 'ALL' 
        ? requests 
        : requests.filter(r => r.type === filterType);

    if (isLoading) {
        return (
            <GlassCard className="text-center py-12">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-12 h-12 mx-auto mb-4 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full"
                />
                <p className="text-white/60">Loading emergency requests...</p>
            </GlassCard>
        );
    }

    return (
        <div className="space-y-6">
            <BlurFade>
                <GlassCard>
                    <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-orange-500/20 rounded-xl">
                                <Radio className="w-8 h-8 text-orange-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Emergency Requests</h2>
                                <p className="text-sm text-white/60">Match requests with available resources</p>
                            </div>
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-white/60" />
                            {['ALL', 'MEDICAL', 'SHELTER', 'FOOD', 'TRANSPORT'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setFilterType(type)}
                                    className={cn(
                                        'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300',
                                        filterType === type
                                            ? 'bg-cyan-500/30 border border-cyan-400/50 text-cyan-300'
                                            : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                                    )}
                                >
                                    {type === 'ALL' ? 'All' : typeIcons[type as keyof typeof typeIcons]} {type !== 'ALL' && type}
                                </button>
                            ))}
                        </div>
                    </div>
                </GlassCard>
            </BlurFade>

            <AnimatePresence mode="popLayout">
                {filteredRequests.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <GlassCard className="text-center py-12">
                            <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-white/30" />
                            <p className="text-white/60">No emergency requests found</p>
                            <p className="text-sm text-white/40 mt-2">Requests will appear here when people need help</p>
                        </GlassCard>
                    </motion.div>
                ) : (
                    filteredRequests.map((request, index) => (
                        <BlurFade key={request.id} delay={index * 0.1}>
                            <GlassCard className="space-y-4">
                                {/* Request Header */}
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3 flex-1">
                                        <div className="text-4xl">{typeIcons[request.type]}</div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 flex-wrap mb-2">
                                                <h3 className="font-bold text-xl text-white">{request.type}</h3>
                                                <span className={cn(
                                                    'px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm',
                                                    priorityColors[request.priority]
                                                )}>
                                                    {request.priority} Priority
                                                </span>
                                                <span className={cn(
                                                    'px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm',
                                                    statusColors[request.status]
                                                )}>
                                                    {request.status}
                                                </span>
                                            </div>
                                            <p className="text-white/80 leading-relaxed">{request.description}</p>
                                            <div className="flex items-center gap-2 mt-2 text-sm text-white/60">
                                                <MapPin className="w-4 h-4" />
                                                <span>{request.location.address}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Matching Resources */}
                                <div className="pt-4 border-t border-white/10">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Package className="w-5 h-5 text-green-400" />
                                        <h4 className="font-semibold text-white">Matching Resources Nearby</h4>
                                        <span className="px-2 py-0.5 bg-green-500/20 rounded-full text-xs text-green-300">
                                            {findMatchingResources(request).length} available
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        {findMatchingResources(request).length === 0 ? (
                                            <div className="text-center py-6 bg-white/5 rounded-lg border border-white/10">
                                                <Clock className="w-10 h-10 mx-auto mb-2 text-white/30" />
                                                <p className="text-sm text-white/60">No matching resources available yet</p>
                                                <p className="text-xs text-white/40 mt-1">Check back soon for updates</p>
                                            </div>
                                        ) : (
                                            findMatchingResources(request).map((resource) => (
                                                <motion.div
                                                    key={resource.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                                                >
                                                    <div className="flex-1">
                                                        <p className="text-white font-medium mb-1">{resource.description}</p>
                                                        <div className="flex items-center gap-2 text-sm text-white/60">
                                                            <Navigation className="w-4 h-4" />
                                                            <span>{resource.location.address}</span>
                                                            <span className="text-cyan-400">
                                                                (~{calculateDistance(
                                                                    request.location.lat,
                                                                    request.location.lng,
                                                                    resource.location.lat,
                                                                    resource.location.lng
                                                                ).toFixed(1)} km away)
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <GlassButton
                                                        onClick={() => handleMatch(request, resource)}
                                                        className="ml-4"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                                        Match
                                                    </GlassButton>
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </GlassCard>
                        </BlurFade>
                    ))
                )}
            </AnimatePresence>
        </div>
    );
}
'use client';

import { useEffect, useState } from 'react';
import { DatabaseService } from '@/lib/database';
import { EmergencyRequest, Resource } from '@/types';
import toast from 'react-hot-toast';

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
            // Reload data to show updated status
            await loadData();
        } catch (error: any) {
            toast.error(error.message || 'Failed to create match', { id: 'match-loading' });
            console.error('Match error:', error);
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
            ) <= 25 // Within 25km radius
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
            case 'HIGH': return 'bg-red-100 text-red-800 border-red-300';
            case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'LOW': return 'bg-green-100 text-green-800 border-green-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading requests and resources...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Match Requests with Resources</h2>
                
                <div className="flex gap-2 mb-4 overflow-x-auto">
                    {(['ALL', 'MEDICAL', 'SHELTER', 'FOOD', 'TRANSPORT'] as const).map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                                filter === type
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {type === 'ALL' ? 'All' : `${getTypeIcon(type)} ${type}`}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid gap-6">
                {filteredRequests.length === 0 ? (
                    <div className="bg-white p-8 rounded-lg shadow-md text-center">
                        <p className="text-gray-500 text-lg">No requests found</p>
                        <p className="text-sm text-gray-400 mt-2">Check back later or try a different filter</p>
                    </div>
                ) : (
                    filteredRequests.map(request => {
                        const matches = findMatchingResources(request);
                        return (
                            <div key={request.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">
                                            {getTypeIcon(request.type)} {request.type}
                                        </h3>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 border ${getPriorityColor(request.priority)}`}>
                                            {request.priority} PRIORITY
                                        </span>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                        request.status === 'MATCHED' ? 'bg-green-100 text-green-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {request.status}
                                    </span>
                                </div>
                                
                                <p className="text-gray-700 mb-2">{request.description}</p>
                                <p className="text-sm text-gray-500 mb-4">📍 {request.location.address}</p>
                                
                                <div className="mt-4 pt-4 border-t">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="font-semibold text-gray-700">
                                            Available Resources ({matches.length})
                                        </h4>
                                        {matches.length === 0 && (
                                            <span className="text-xs text-gray-500">No nearby matches</span>
                                        )}
                                    </div>
                                    
                                    <div className="space-y-2">
                                        {matches.length === 0 ? (
                                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                                                <p className="text-sm text-gray-500">
                                                    No matching resources found within 25km radius
                                                </p>
                                            </div>
                                        ) : (
                                            matches.map(resource => {
                                                const distance = calculateDistance(
                                                    request.location.lat,
                                                    request.location.lng,
                                                    resource.location.lat,
                                                    resource.location.lng
                                                );
                                                return (
                                                    <div key={resource.id} className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-800">{resource.description}</p>
                                                            <p className="text-sm text-gray-600 mt-1">📍 {resource.location.address}</p>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                Distance: {distance.toFixed(2)} km away
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => handleMatch(request, resource)}
                                                            disabled={request.status === 'MATCHED'}
                                                            className="ml-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
                                                        >
                                                            {request.status === 'MATCHED' ? 'Matched' : 'Connect'}
                                                        </button>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
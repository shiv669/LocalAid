'use client';

import { useEffect, useState } from 'react';
import { databases, client } from '@/lib/appwrite';
import { EmergencyRequest, Resource } from '@/types';
import toast from 'react-hot-toast';

type Update = {
    id: string;
    type: 'request' | 'resource' | 'match';
    message: string;
    timestamp: string;
    priority?: 'HIGH' | 'MEDIUM' | 'LOW';
};

export default function RealtimeUpdates() {
    const [updates, setUpdates] = useState<Update[]>([]);
    const [isExpanded, setIsExpanded] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
        
        // Subscribe to requests collection
        const requestsUnsubscribe = client.subscribe(
            `databases.${DATABASE_ID}.collections.requests.documents`, 
            (response) => {
                if (response.events.includes('databases.*.collections.*.documents.*.create')) {
                    const request = response.payload as any;
                    addUpdate({
                        id: request.$id,
                        type: 'request',
                        message: `New ${request.type} request - ${request.priority} priority`,
                        timestamp: new Date().toLocaleTimeString(),
                        priority: request.priority
                    });
                }

                if (response.events.includes('databases.*.collections.*.documents.*.update')) {
                    const request = response.payload as any;
                    addUpdate({
                        id: request.$id,
                        type: 'request',
                        message: `Request ${request.type} updated - Status: ${request.status}`,
                        timestamp: new Date().toLocaleTimeString()
                    });
                }
            }
        );

        // Subscribe to resources collection
        const resourcesUnsubscribe = client.subscribe(
            `databases.${DATABASE_ID}.collections.resources.documents`,
            (response) => {
                if (response.events.includes('databases.*.collections.*.documents.*.create')) {
                    const resource = response.payload as any;
                    addUpdate({
                        id: resource.$id,
                        type: 'resource',
                        message: `New ${resource.type} resource available`,
                        timestamp: new Date().toLocaleTimeString()
                    });
                }
            }
        );

        // Subscribe to matches collection
        const matchesUnsubscribe = client.subscribe(
            `databases.${DATABASE_ID}.collections.matches.documents`,
            (response) => {
                if (response.events.includes('databases.*.collections.*.documents.*.create')) {
                    const match = response.payload as any;
                    addUpdate({
                        id: match.$id,
                        type: 'match',
                        message: 'New match created! Request connected with resource.',
                        timestamp: new Date().toLocaleTimeString()
                    });
                }
            }
        );

        // Cleanup subscriptions
        return () => {
            requestsUnsubscribe();
            resourcesUnsubscribe();
            matchesUnsubscribe();
        };
    }, []);

    const addUpdate = (update: Update) => {
        setUpdates(prev => [update, ...prev].slice(0, 20)); // Keep only last 20 updates
        
        if (!isExpanded) {
            setUnreadCount(prev => prev + 1);
        }

        // Show toast notification with icon based on type
        const icon = update.type === 'request' ? '🚨' : 
                     update.type === 'resource' ? '✨' : '🤝';
        toast(update.message, { icon });
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
        if (!isExpanded) {
            setUnreadCount(0);
        }
    };

    const getUpdateColor = (type: string, priority?: string) => {
        if (type === 'request' && priority === 'HIGH') return 'border-l-red-500 bg-red-50';
        if (type === 'match') return 'border-l-green-500 bg-green-50';
        if (type === 'resource') return 'border-l-blue-500 bg-blue-50';
        return 'border-l-yellow-500 bg-yellow-50';
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'request': return '🚨';
            case 'resource': return '✨';
            case 'match': return '🤝';
            default: return '📢';
        }
    };

    return (
        <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50">
            <div 
                className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg cursor-pointer"
                onClick={toggleExpand}
            >
                <div className="flex items-center space-x-2">
                    <span className="text-xl">🔔</span>
                    <h3 className="font-bold">Live Updates</h3>
                    {!isExpanded && unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </div>
                <button className="text-white hover:text-gray-200 transition">
                    {isExpanded ? '−' : '+'}
                </button>
            </div>
            
            {isExpanded && (
                <div className="max-h-96 overflow-y-auto">
                    {updates.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <p className="text-4xl mb-2">🔕</p>
                            <p className="text-sm">No updates yet</p>
                            <p className="text-xs mt-1">You'll be notified of new activity</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {updates.map((update) => (
                                <div 
                                    key={`${update.id}-${update.timestamp}`}
                                    className={`p-3 border-l-4 ${getUpdateColor(update.type, update.priority)} hover:bg-opacity-80 transition`}
                                >
                                    <div className="flex items-start space-x-2">
                                        <span className="text-lg">{getTypeIcon(update.type)}</span>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-800">
                                                {update.message}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {update.timestamp}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
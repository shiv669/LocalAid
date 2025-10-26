'use client';

import { useEffect, useState } from 'react';
import { databases, client } from '@/lib/appwrite';
import { EmergencyRequest } from '@/types';
import toast from 'react-hot-toast';
import { GlassCard } from '@/components/ui/glass-components';
import { Bell, Wifi, WifiOff, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Update {
    message: string;
    timestamp: string;
    type: 'create' | 'update' | 'match';
}

export default function RealtimeUpdates() {
    const [updates, setUpdates] = useState<Update[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        setIsConnected(true);
        
        // Subscribe to realtime updates
        const unsubscribe = client.subscribe(`databases.${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}.collections.requests.documents`, response => {
            if (response.events.includes('databases.*.collections.*.documents.*.create')) {
                const request = response.payload as EmergencyRequest;
                addUpdate(`New emergency request: ${request.type} - ${request.priority} priority`, 'create');
            }

            if (response.events.includes('databases.*.collections.*.documents.*.update')) {
                const request = response.payload as EmergencyRequest;
                addUpdate(`Request updated: ${request.type} - Status: ${request.status}`, 'update');
            }
        });

        // Cleanup subscription
        return () => {
            setIsConnected(false);
            unsubscribe();
        };
    }, []);

    const addUpdate = (message: string, type: Update['type']) => {
        setUpdates(prev => [{
            message,
            timestamp: new Date().toLocaleTimeString(),
            type
        }, ...prev].slice(0, 10)); // Keep only last 10 updates

        // Show toast notification
        toast(message, {
            icon: type === 'create' ? '🆕' : type === 'update' ? '�' : '🤝',
        });
    };

    const getUpdateColor = (type: Update['type']) => {
        switch (type) {
            case 'create':
                return 'border-l-4 border-blue-400 bg-blue-500/5';
            case 'update':
                return 'border-l-4 border-yellow-400 bg-yellow-500/5';
            case 'match':
                return 'border-l-4 border-green-400 bg-green-500/5';
            default:
                return 'border-l-4 border-gray-400 bg-gray-500/5';
        }
    };

    const getUpdateIcon = (type: Update['type']) => {
        switch (type) {
            case 'create':
                return <AlertCircle className="w-4 h-4 text-blue-400" />;
            case 'update':
                return <Clock className="w-4 h-4 text-yellow-400" />;
            case 'match':
                return <CheckCircle className="w-4 h-4 text-green-400" />;
            default:
                return <Bell className="w-4 h-4 text-gray-400" />;
        }
    };

    return (
        <GlassCard className="fixed top-20 right-4 w-96 max-h-[28rem] overflow-hidden flex flex-col z-50">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-bold text-white">Live Updates</h3>
                </div>
                <div className="flex items-center gap-2">
                    {isConnected ? (
                        <>
                            <Wifi className="w-4 h-4 text-green-400" />
                            <span className="text-xs text-green-400">Connected</span>
                        </>
                    ) : (
                        <>
                            <WifiOff className="w-4 h-4 text-red-400" />
                            <span className="text-xs text-red-400">Disconnected</span>
                        </>
                    )}
                </div>
            </div>

            {/* Updates List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                    {updates.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-8 text-gray-400"
                        >
                            <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No updates yet</p>
                            <p className="text-xs mt-1">Waiting for real-time events...</p>
                        </motion.div>
                    ) : (
                        updates.map((update, index) => (
                            <motion.div
                                key={`${update.timestamp}-${index}`}
                                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className={cn(
                                    'p-3 rounded-lg backdrop-blur-sm',
                                    getUpdateColor(update.type)
                                )}
                            >
                                <div className="flex items-start gap-2">
                                    <div className="mt-0.5">
                                        {getUpdateIcon(update.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white/90 leading-relaxed">
                                            {update.message}
                                        </p>
                                        <p className="text-xs text-white/50 mt-1 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {update.timestamp}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </GlassCard>
    );
}
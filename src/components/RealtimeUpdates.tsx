import { useEffect, useState } from 'react';
import { databases, client } from '@/lib/appwrite';
import { EmergencyRequest } from '@/types';
import toast from 'react-hot-toast';

export default function RealtimeUpdates() {
    const [updates, setUpdates] = useState<{ message: string; timestamp: string }[]>([]);

    useEffect(() => {
        // Subscribe to realtime updates
        const unsubscribe = client.subscribe(`databases.${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}.collections.requests.documents`, response => {
            if (response.events.includes('databases.*.collections.*.documents.*.create')) {
                const request = response.payload as EmergencyRequest;
                addUpdate(`New emergency request: ${request.type} - ${request.priority} priority`);
            }

            if (response.events.includes('databases.*.collections.*.documents.*.update')) {
                const request = response.payload as EmergencyRequest;
                addUpdate(`Request updated: ${request.type} - Status: ${request.status}`);
            }
        });

        // Cleanup subscription
        return () => {
            unsubscribe();
        };
    }, []);

    const addUpdate = (message: string) => {
        setUpdates(prev => [{
            message,
            timestamp: new Date().toLocaleTimeString()
        }, ...prev].slice(0, 10)); // Keep only last 10 updates

        // Show toast notification
        toast(message, {
            icon: '🔔',
        });
    };

    return (
        <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg p-4 max-h-96 overflow-y-auto">
            <h3 className="font-bold mb-4">Live Updates</h3>
            <div className="space-y-2">
                {updates.map((update, index) => (
                    <div key={index} className="text-sm border-b pb-2">
                        <p>{update.message}</p>
                        <p className="text-xs text-gray-500">{update.timestamp}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
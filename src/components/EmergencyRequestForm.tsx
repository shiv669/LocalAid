import { useState } from 'react';
import { DatabaseService } from '@/lib/database';
import toast from 'react-hot-toast';

export default function EmergencyRequestForm() {
    const [type, setType] = useState<'MEDICAL' | 'SHELTER' | 'FOOD' | 'TRANSPORT'>('MEDICAL');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM');
    const [location, setLocation] = useState({ lat: 0, lng: 0, address: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Get current user's location
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const { latitude, longitude } = position.coords;
                    
                    // Create the request
                    await DatabaseService.createRequest({
                        userId: 'current-user-id', // You'll need to get this from your auth context
                        type,
                        description,
                        priority,
                        status: 'PENDING',
                        location: {
                            lat: latitude,
                            lng: longitude,
                            address: location.address
                        }
                    });

                    toast.success('Emergency request created successfully!');
                    // Reset form
                    setDescription('');
                    setLocation({ lat: 0, lng: 0, address: '' });
                });
            }
        } catch (error) {
            toast.error('Failed to create emergency request');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6 bg-white rounded-lg shadow">
            <div>
                <label className="block text-sm font-medium text-gray-700">Type of Emergency</label>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    <option value="MEDICAL">Medical</option>
                    <option value="SHELTER">Shelter</option>
                    <option value="FOOD">Food</option>
                    <option value="TRANSPORT">Transport</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={3}
                    placeholder="Describe your emergency..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                    type="text"
                    value={location.address}
                    onChange={(e) => setLocation({ ...location, address: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter your address"
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
                {isLoading ? 'Creating...' : 'Create Emergency Request'}
            </button>
        </form>
    );
}
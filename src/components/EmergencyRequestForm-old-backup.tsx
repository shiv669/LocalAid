'use client';

import { useState, useEffect } from 'react';
import { account } from '@/lib/appwrite';
import { DatabaseService } from '@/lib/database';
import toast from 'react-hot-toast';

export default function EmergencyRequestForm() {
    const [type, setType] = useState<'MEDICAL' | 'SHELTER' | 'FOOD' | 'TRANSPORT'>('FOOD');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM');
    const [location, setLocation] = useState({ lat: 0, lng: 0, address: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [locationLoaded, setLocationLoaded] = useState(false);

    useEffect(() => {
        getCurrentLocation();
    }, []);

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation(prev => ({
                        ...prev,
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    }));
                    setLocationLoaded(true);
                    toast.success('Location detected');
                },
                (error) => {
                    console.error('Error getting location:', error);
                    toast.error('Could not get your location. Please enter address manually.');
                }
            );
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!description.trim() || !location.address.trim()) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (!locationLoaded) {
            toast.error('Location is required. Please enable location access or wait for it to load.');
            return;
        }

        setIsLoading(true);

        try {
            const user = await account.get();
            
            await DatabaseService.createRequest({
                userId: user.$id,
                type,
                description,
                priority,
                status: 'PENDING',
                location: {
                    lat: location.lat,
                    lng: location.lng,
                    address: location.address
                }
            });

            toast.success('Emergency request created successfully!');
            // Reset form
            setDescription('');
            setLocation({ lat: location.lat, lng: location.lng, address: '' });
        } catch (error: any) {
            toast.error(error.message || 'Failed to create emergency request');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Request Emergency Help</h2>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type of Help Needed <span className="text-red-500">*</span>
                </label>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="MEDICAL">🏥 Medical Supplies</option>
                    <option value="SHELTER">🏠 Shelter</option>
                    <option value="FOOD">🍲 Food & Water</option>
                    <option value="TRANSPORT">🚗 Transportation</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                    {(['HIGH', 'MEDIUM', 'LOW'] as const).map((p) => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => setPriority(p)}
                            className={`p-3 rounded-lg border-2 font-medium transition ${
                                priority === p
                                    ? p === 'HIGH'
                                        ? 'border-red-500 bg-red-50 text-red-700'
                                        : p === 'MEDIUM'
                                        ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                                        : 'border-green-500 bg-green-50 text-green-700'
                                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={4}
                    placeholder="Describe what you need and any specific details..."
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={location.address}
                    onChange={(e) => setLocation({ ...location, address: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Street address, city, state"
                    required
                />
                {locationLoaded && (
                    <p className="mt-1 text-xs text-green-600">
                        ✓ Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </p>
                )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Your request will be visible to verified helpers in your area.
                </p>
            </div>

            <button
                type="submit"
                disabled={isLoading || !locationLoaded}
                className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 disabled:bg-gray-400 transition font-medium"
            >
                {isLoading ? 'Submitting...' : '🚨 Submit Emergency Request'}
            </button>
        </form>
    );
}
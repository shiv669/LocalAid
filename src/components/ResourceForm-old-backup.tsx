'use client';

import { useState, useEffect } from 'react';
import { account } from '@/lib/appwrite';
import { DatabaseService } from '@/lib/database';
import toast from 'react-hot-toast';

export default function ResourceForm() {
    const [type, setType] = useState<'MEDICAL' | 'SHELTER' | 'FOOD' | 'TRANSPORT'>('FOOD');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState({ lat: 0, lng: 0, address: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [locationLoaded, setLocationLoaded] = useState(false);
    const [availability, setAvailability] = useState(true);

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
            toast.error('Location is required. Please enable location access.');
            return;
        }

        setIsLoading(true);

        try {
            const user = await account.get();
            
            await DatabaseService.createResource({
                userId: user.$id,
                type,
                description,
                availability,
                location: {
                    lat: location.lat,
                    lng: location.lng,
                    address: location.address
                }
            });

            toast.success('Resource listed successfully!');
            // Reset form
            setDescription('');
            setLocation({ lat: location.lat, lng: location.lng, address: '' });
            setAvailability(true);
        } catch (error: any) {
            toast.error(error.message || 'Failed to list resource');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Offer Resources</h2>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type of Resource <span className="text-red-500">*</span>
                </label>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                    <option value="MEDICAL">🏥 Medical Supplies</option>
                    <option value="SHELTER">🏠 Shelter</option>
                    <option value="FOOD">🍲 Food & Water</option>
                    <option value="TRANSPORT">🚗 Transportation</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    rows={4}
                    placeholder="Describe what resources you can provide..."
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location Address <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={location.address}
                    onChange={(e) => setLocation({ ...location, address: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Street address, city, state"
                    required
                />
                {locationLoaded && (
                    <p className="mt-1 text-xs text-green-600">
                        ✓ Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </p>
                )}
            </div>

            <div className="flex items-center space-x-3">
                <input
                    type="checkbox"
                    id="availability"
                    checked={availability}
                    onChange={(e) => setAvailability(e.target.checked)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="availability" className="text-sm font-medium text-gray-700">
                    Resource is currently available
                </label>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                    <strong>Note:</strong> By listing this resource, you agree to be contacted by people in need.
                    You can update availability at any time.
                </p>
            </div>

            <button
                type="submit"
                disabled={isLoading || !locationLoaded}
                className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition font-medium"
            >
                {isLoading ? 'Listing...' : '✨ List Resource'}
            </button>
        </form>
    );
}

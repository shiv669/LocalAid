'use client';

import { useState, useEffect } from 'react';
import { account } from '@/lib/appwrite';
import { DatabaseService } from '@/lib/database';
import toast from 'react-hot-toast';
import { GlassButton, GlassInput, GlassCard } from '@/components/ui/glass-components';
import { BlurFade } from '@/components/ui/blur-fade';
import { AlertTriangle, MapPin, Navigation, FileText, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function EmergencyRequestForm() {
    const [type, setType] = useState<'MEDICAL' | 'SHELTER' | 'FOOD' | 'TRANSPORT'>('MEDICAL');
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
            toast.error('Location is required. Please enable location access.');
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
            setDescription('');
            setLocation({ lat: location.lat, lng: location.lng, address: '' });
            setPriority('MEDIUM');
        } catch (error: any) {
            toast.error(error.message || 'Failed to create emergency request');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const emergencyTypes = [
        { value: 'MEDICAL', label: 'Medical Emergency', icon: '🏥', color: 'border-red-500/50 bg-red-500/10 hover:bg-red-500/20' },
        { value: 'SHELTER', label: 'Need Shelter', icon: '🏠', color: 'border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20' },
        { value: 'FOOD', label: 'Food & Water', icon: '🍲', color: 'border-green-500/50 bg-green-500/10 hover:bg-green-500/20' },
        { value: 'TRANSPORT', label: 'Transportation', icon: '🚗', color: 'border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20' },
    ];

    const priorityLevels = [
        { value: 'HIGH', label: 'Critical', color: 'bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30' },
        { value: 'MEDIUM', label: 'Urgent', color: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/30' },
        { value: 'LOW', label: 'Standard', color: 'bg-green-500/20 border-green-500/50 text-green-300 hover:bg-green-500/30' },
    ];

    return (
        <GlassCard className="max-w-3xl mx-auto">
            <BlurFade>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-red-500/20 rounded-xl">
                        <AlertTriangle className="w-8 h-8 text-red-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Request Emergency Help</h2>
                        <p className="text-sm text-white/60">Get immediate assistance from nearby responders</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Emergency Type Selection */}
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-3 flex items-center gap-2">
                            <Radio className="w-4 h-4" />
                            Type of Emergency
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {emergencyTypes.map((item) => (
                                <button
                                    key={item.value}
                                    type="button"
                                    onClick={() => setType(item.value as any)}
                                    className={cn(
                                        'p-4 rounded-xl border-2 backdrop-blur-sm transition-all duration-300',
                                        'flex items-center gap-3 text-left',
                                        type === item.value
                                            ? item.color + ' ring-2 ring-white/30'
                                            : 'border-white/10 bg-white/5 hover:bg-white/10 text-white/70'
                                    )}
                                >
                                    <span className="text-2xl">{item.icon}</span>
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Describe Your Emergency
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                                     text-white placeholder:text-white/40 backdrop-blur-sm
                                     focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50
                                     transition-all duration-300"
                            rows={4}
                            placeholder="Provide details about what kind of help you need..."
                            required
                        />
                    </div>

                    {/* Priority Level */}
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Priority Level
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {priorityLevels.map((item) => (
                                <button
                                    key={item.value}
                                    type="button"
                                    onClick={() => setPriority(item.value as any)}
                                    className={cn(
                                        'p-3 rounded-xl border-2 backdrop-blur-sm transition-all duration-300 font-medium',
                                        priority === item.value
                                            ? item.color + ' ring-2 ring-white/30'
                                            : 'border-white/10 bg-white/5 hover:bg-white/10 text-white/70'
                                    )}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-3 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Location {locationLoaded && <span className="text-green-400 text-xs">(GPS detected)</span>}
                        </label>
                        <div className="space-y-3">
                            <GlassInput
                                type="text"
                                value={location.address}
                                onChange={(e) => setLocation({ ...location, address: e.target.value })}
                                placeholder="Enter your address or landmark"
                                icon={<MapPin className="w-4 h-4" />}
                                required
                            />
                            <button
                                type="button"
                                onClick={getCurrentLocation}
                                className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-2 transition-colors"
                            >
                                <Navigation className="w-4 h-4" />
                                Refresh GPS Location
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <GlassButton
                        type="submit"
                        disabled={isLoading}
                        className="w-full"
                    >
                        {isLoading ? 'Sending Request...' : 'Send Emergency Request'}
                    </GlassButton>
                </form>
            </BlurFade>
        </GlassCard>
    );
}
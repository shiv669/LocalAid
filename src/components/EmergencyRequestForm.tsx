'use client';

import { useState, useEffect } from 'react';
import { account } from '@/lib/appwrite';
import { DatabaseService } from '@/lib/database';
import toast from 'react-hot-toast';
import { GlassButton, GlassInput, GlassCard } from '@/components/ui/glass-components';
import { BlurFade } from '@/components/ui/blur-fade';
import { AlertCircle, MapPin, Navigation, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

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
            setDescription('');
            setLocation({ lat: location.lat, lng: location.lng, address: '' });
        } catch (error: any) {
            toast.error(error.message || 'Failed to create emergency request');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const requestTypes = [
        { value: 'MEDICAL', label: 'Medical Supplies', icon: '🏥', color: 'border-red-500/50 bg-red-500/10 hover:bg-red-500/20' },
        { value: 'SHELTER', label: 'Shelter', icon: '🏠', color: 'border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20' },
        { value: 'FOOD', label: 'Food & Water', icon: '🍲', color: 'border-green-500/50 bg-green-500/10 hover:bg-green-500/20' },
        { value: 'TRANSPORT', label: 'Transportation', icon: '🚗', color: 'border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20' },
    ];

    const priorityLevels = [
        { value: 'HIGH', label: 'High', color: 'border-red-500 bg-red-500/20 text-red-400' },
        { value: 'MEDIUM', label: 'Medium', color: 'border-yellow-500 bg-yellow-500/20 text-yellow-400' },
        { value: 'LOW', label: 'Low', color: 'border-green-500 bg-green-500/20 text-green-400' },
    ];

    return (
        <GlassCard className="max-w-3xl mx-auto">
            <BlurFade>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-red-500/20 rounded-xl">
                        <AlertCircle className="w-8 h-8 text-red-400" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-foreground">Request Emergency Help</h2>
                        <p className="text-muted-foreground">Get connected with nearby helpers</p>
                    </div>
                </div>
            </BlurFade>

            <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                <BlurFade delay={0.1}>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-3">
                            Type of Help Needed <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {requestTypes.map((t) => (
                                <button
                                    key={t.value}
                                    type="button"
                                    onClick={() => setType(t.value as any)}
                                    className={cn(
                                        "p-4 rounded-xl border-2 transition-all text-center",
                                        type === t.value
                                            ? `${t.color} border-opacity-100`
                                            : "border-border/30 bg-muted/20 hover:border-border/50"
                                    )}
                                >
                                    <div className="text-3xl mb-2">{t.icon}</div>
                                    <div className={cn(
                                        "text-sm font-medium",
                                        type === t.value ? "text-foreground" : "text-muted-foreground"
                                    )}>
                                        {t.label}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </BlurFade>

                <BlurFade delay={0.2}>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-3">
                            Priority Level <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {priorityLevels.map((p) => (
                                <button
                                    key={p.value}
                                    type="button"
                                    onClick={() => setPriority(p.value as any)}
                                    className={cn(
                                        "p-4 rounded-xl border-2 font-medium transition-all",
                                        priority === p.value
                                            ? `${p.color} border-opacity-100`
                                            : "border-border/30 bg-muted/20 text-muted-foreground hover:border-border/50"
                                    )}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </BlurFade>

                <BlurFade delay={0.3}>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Description <span className="text-red-400">*</span>
                        </label>
                        <div className="glass-input-wrap">
                            <div className="glass-input">
                                <span className="glass-input-text-area"></span>
                                <div className="relative z-10 flex-shrink-0 flex items-center justify-center w-10 pl-2">
                                    <FileText className="w-5 h-5 text-foreground/60" />
                                </div>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe what you need help with..."
                                    rows={4}
                                    className="relative z-10 h-full w-0 flex-grow bg-transparent text-foreground placeholder:text-foreground/60 focus:outline-none resize-none py-3"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </BlurFade>

                <BlurFade delay={0.4}>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Location Address <span className="text-red-400">*</span>
                        </label>
                        <GlassInput
                            type="text"
                            value={location.address}
                            onChange={(e) => setLocation({ ...location, address: e.target.value })}
                            placeholder="Enter your address"
                            icon={<MapPin className="w-5 h-5 text-foreground/60" />}
                            endIcon={
                                locationLoaded ? (
                                    <div className="flex items-center gap-2 text-green-400 text-xs font-medium pr-2">
                                        <Navigation className="w-4 h-4" />
                                        GPS
                                    </div>
                                ) : null
                            }
                            required
                        />
                        {locationLoaded && (
                            <p className="text-xs text-muted-foreground mt-2">
                                GPS coordinates detected: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                            </p>
                        )}
                    </div>
                </BlurFade>

                <BlurFade delay={0.5}>
                    <GlassButton
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                        contentClassName="flex items-center justify-center gap-2 text-lg py-1"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-foreground" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <AlertCircle className="w-5 h-5" />
                                Submit Emergency Request
                            </>
                        )}
                    </GlassButton>
                </BlurFade>
            </form>
        </GlassCard>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { account } from '@/lib/appwrite';
import { DatabaseService } from '@/lib/database';
import { UserProfile } from '@/types';
import toast from 'react-hot-toast';

export default function UserProfileComponent() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [authUser, setAuthUser] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        role: 'HELPER' as 'HELPER' | 'SEEKER' | 'ADMIN',
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const user = await account.get();
            setAuthUser(user);
            const userProfile = await DatabaseService.getUserProfile(user.$id);
            
            if (userProfile) {
                setProfile(userProfile);
                setFormData({
                    name: userProfile.name,
                    role: userProfile.role,
                });
            } else {
                setIsEditing(true);
            }
        } catch (error) {
            console.error('Failed to load profile:', error);
        }
    };

    const handleResendVerification = async () => {
        try {
            const verificationUrl = `${window.location.origin}/verify`;
            await account.createVerification(verificationUrl);
            toast.success('Verification email sent! Please check your inbox.');
        } catch (error: any) {
            toast.error(error.message || 'Failed to send verification email');
            console.error(error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            toast.error('Please enter your name');
            return;
        }

        try {
            setIsLoading(true);
            const user = await account.get();
            
            // Use phone if available, otherwise use a truncated version or placeholder
            let phoneValue = user.phone || 'N/A';
            // Ensure phone field doesn't exceed 20 characters
            if (phoneValue.length > 20) {
                phoneValue = phoneValue.substring(0, 20);
            }
            
            const newProfile = await DatabaseService.createUserProfile(
                user.$id, // Pass the user's auth ID
                {
                    phone: phoneValue,
                    name: formData.name,
                    isVerified: false,
                    role: formData.role,
                }
            );

            setProfile(newProfile as unknown as UserProfile);
            setIsEditing(false);
            toast.success('Profile created successfully!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to create profile');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isEditing && profile) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                        Edit
                    </button>
                </div>
                
                <div className="space-y-3">
                    <div>
                        <label className="text-sm font-medium text-gray-500">Name</label>
                        <p className="text-lg text-gray-900">{profile.name}</p>
                    </div>
                    
                    <div>
                        <label className="text-sm font-medium text-gray-500">Contact</label>
                        <p className="text-lg text-gray-900">
                            {profile.phone === 'N/A' ? 'Email Account' : profile.phone}
                        </p>
                    </div>
                    
                    <div>
                        <label className="text-sm font-medium text-gray-500">Role</label>
                        <p className="text-lg">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                profile.role === 'HELPER' ? 'bg-green-100 text-green-800' :
                                profile.role === 'SEEKER' ? 'bg-blue-100 text-blue-800' :
                                'bg-purple-100 text-purple-800'
                            }`}>
                                {profile.role}
                            </span>
                        </p>
                    </div>
                    
                    <div>
                        <label className="text-sm font-medium text-gray-500">Verification Status</label>
                        <p className="text-lg">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                profile.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {profile.isVerified ? '✓ Verified' : 'Pending Verification'}
                            </span>
                        </p>
                        {!profile.isVerified && authUser && authUser.emailVerification === false && (
                            <button
                                onClick={handleResendVerification}
                                className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
                            >
                                Resend verification email
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {profile ? 'Edit Profile' : 'Complete Your Profile'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        I want to
                    </label>
                    <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="HELPER">Provide Help</option>
                        <option value="SEEKER">Request Help</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                        {formData.role === 'HELPER' 
                            ? 'You can offer resources to people in need'
                            : 'You can request help during emergencies'}
                    </p>
                </div>
                
                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition font-medium"
                    >
                        {isLoading ? 'Saving...' : 'Save Profile'}
                    </button>
                    
                    {profile && (
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

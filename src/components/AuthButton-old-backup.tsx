'use client';

import { useState, useEffect } from 'react';
import { account } from '@/lib/appwrite';
import { ID } from 'appwrite';
import toast from 'react-hot-toast';

export default function AuthButton() {
    const [isLoading, setIsLoading] = useState(false);
    const [authMode, setAuthMode] = useState<'email' | 'phone'>('email');
    
    // Email auth states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    
    // Phone auth states (backup)
    const [phone, setPhone] = useState('');
    const [userId, setUserId] = useState<string | null>(null);
    const [secret, setSecret] = useState<string>('');
    const [otp, setOtp] = useState('');
    
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            const currentUser = await account.get();
            setUser(currentUser);
        } catch (error) {
            // No active session
            setUser(null);
        }
    };

    // Email Authentication
    const handleEmailSignUp = async () => {
        if (!email || !password || !name) {
            toast.error('Please fill in all fields');
            return;
        }

        if (password.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }

        try {
            setIsLoading(true);
            // Create the account
            await account.create(ID.unique(), email, password, name);
            // Log them in
            await account.createEmailPasswordSession(email, password);
            
            // Send verification email
            try {
                const verificationUrl = `${window.location.origin}/verify`;
                await account.createVerification(verificationUrl);
                toast.success('Account created! Please check your email to verify your account.');
            } catch (verifyError) {
                console.error('Verification email error:', verifyError);
                toast.success('Account created successfully!');
            }
            
            const currentUser = await account.get();
            setUser(currentUser);
        } catch (error: any) {
            toast.error(error.message || 'Failed to create account');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailSignIn = async () => {
        if (!email || !password) {
            toast.error('Please enter email and password');
            return;
        }

        try {
            setIsLoading(true);
            await account.createEmailPasswordSession(email, password);
            const currentUser = await account.get();
            setUser(currentUser);
            toast.success('Signed in successfully!');
        } catch (error: any) {
            toast.error(error.message || 'Invalid credentials');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePhoneAuth = async () => {
        if (!phone || phone.length < 10) {
            toast.error('Please enter a valid phone number');
            return;
        }

        try {
            setIsLoading(true);
            // Format phone number (example: +1234567890)
            const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
            
            // Create phone session
            const token = await account.createPhoneToken(
                ID.unique(),
                formattedPhone
            );
            
            setUserId(token.userId);
            setSecret(token.secret);
            toast.success('OTP sent to your phone!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to send OTP');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!otp || !userId || !secret) {
            toast.error('Please enter the OTP');
            return;
        }

        try {
            setIsLoading(true);
            await account.createSession(userId, secret);
            const currentUser = await account.get();
            setUser(currentUser);
            toast.success('Successfully authenticated!');
        } catch (error: any) {
            toast.error(error.message || 'Invalid OTP');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await account.deleteSession('current');
            setUser(null);
            setEmail('');
            setPassword('');
            setName('');
            setPhone('');
            setOtp('');
            setUserId(null);
            setSecret('');
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error('Failed to logout');
        }
    };

    if (user) {
        return (
            <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                    Welcome, {user.name || user.email || user.phone || 'User'}
                </span>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                    Logout
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-4 p-6 bg-white rounded-lg shadow-md max-w-md">
            <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
            
            {/* Auth Mode Toggle */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                <button
                    onClick={() => setAuthMode('email')}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                        authMode === 'email'
                            ? 'bg-white text-blue-600 shadow'
                            : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                    📧 Email
                </button>
                <button
                    onClick={() => setAuthMode('phone')}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                        authMode === 'phone'
                            ? 'bg-white text-blue-600 shadow'
                            : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                    📱 Phone
                </button>
            </div>

            {authMode === 'email' ? (
                <>
                    {/* Email Authentication Form */}
                    {isSignUp && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your.email@example.com"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {isSignUp && (
                            <p className="mt-1 text-xs text-gray-500">
                                Minimum 8 characters
                            </p>
                        )}
                    </div>
                    
                    <button
                        onClick={isSignUp ? handleEmailSignUp : handleEmailSignIn}
                        disabled={isLoading}
                        className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition font-medium"
                    >
                        {isLoading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
                    </button>
                    
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                    </button>
                </>
            ) : (
                <>
                    {/* Phone Authentication (Original) */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-xs text-yellow-800">
                            ⚠️ Phone auth requires SMS credits. Use Email auth (free) or upgrade your Appwrite plan.
                        </p>
                    </div>
                    
                    {!userId ? (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+1234567890"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Include country code (e.g., +1 for US)
                                </p>
                            </div>
                            <button
                                onClick={handlePhoneAuth}
                                disabled={isLoading}
                                className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition font-medium"
                            >
                                {isLoading ? 'Sending OTP...' : 'Send Verification Code'}
                            </button>
                        </>
                    ) : (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Enter OTP
                                </label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="123456"
                                    maxLength={6}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <button
                                onClick={handleVerifyOTP}
                                disabled={isLoading}
                                className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition font-medium"
                            >
                                {isLoading ? 'Verifying...' : 'Verify OTP'}
                            </button>
                            <button
                                onClick={() => {
                                    setUserId(null);
                                    setSecret('');
                                    setOtp('');
                                }}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                Change phone number
                            </button>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
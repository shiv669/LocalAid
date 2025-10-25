'use client';

import { useState, useEffect } from 'react';
import AuthButton from '@/components/AuthButton';
import UserProfile from '@/components/UserProfile';
import EmergencyRequestForm from '@/components/EmergencyRequestForm';
import ResourceForm from '@/components/ResourceForm';
import ResourceMatcher from '@/components/ResourceMatcher';
import RealtimeUpdates from '@/components/RealtimeUpdates';
import { account } from '@/lib/appwrite';
import { Toaster } from 'react-hot-toast';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'request' | 'offer' | 'profile'>('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading LocalAid Connect...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <Toaster position="top-right" />
        
        <div className="max-w-4xl w-full text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🆘 LocalAid Connect
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Connecting Communities in Times of Crisis
          </p>
          <p className="text-gray-500">
            Real-time emergency response platform that matches helpers with those in need
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl w-full mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-3">🚨</div>
            <h3 className="font-bold text-lg mb-2">Request Help</h3>
            <p className="text-sm text-gray-600">
              Post emergency requests and get matched with nearby helpers instantly
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-3">🤝</div>
            <h3 className="font-bold text-lg mb-2">Offer Resources</h3>
            <p className="text-sm text-gray-600">
              Share your resources and help people in your community during crises
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-3">📍</div>
            <h3 className="font-bold text-lg mb-2">Real-time Matching</h3>
            <p className="text-sm text-gray-600">
              Location-based matching ensures help reaches those who need it most
            </p>
          </div>
        </div>

        <AuthButton />

        <div className="mt-8 max-w-2xl text-center">
          <p className="text-xs text-gray-500">
            Built with ❤️ using Appwrite • Secure • Real-time • Community-driven
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🆘 LocalAid Connect</h1>
              <p className="text-sm text-gray-500">Helping communities in real-time</p>
            </div>
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'request', label: 'Request Help', icon: '🚨' },
              { id: 'offer', label: 'Offer Resources', icon: '✨' },
              { id: 'profile', label: 'Profile', icon: '👤' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Welcome to LocalAid Connect
              </h2>
              <p className="text-gray-600 mb-4">
                This platform helps connect people in need with those who can help during emergencies.
                Browse active requests, offer your resources, or create an emergency request.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="text-2xl mb-2">🚨</div>
                  <h3 className="font-semibold text-gray-800">Active Requests</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    View and respond to emergency requests in your area
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-2xl mb-2">✨</div>
                  <h3 className="font-semibold text-gray-800">Available Resources</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    See what help is available from community helpers
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-2xl mb-2">🤝</div>
                  <h3 className="font-semibold text-gray-800">Successful Matches</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Real-time connections helping communities
                  </p>
                </div>
              </div>
            </div>
            
            <ResourceMatcher />
          </div>
        )}

        {activeTab === 'request' && (
          <div className="max-w-3xl mx-auto">
            <EmergencyRequestForm />
          </div>
        )}

        {activeTab === 'offer' && (
          <div className="max-w-3xl mx-auto">
            <ResourceForm />
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto">
            <UserProfile />
          </div>
        )}
      </main>

      {/* Real-time Updates Widget */}
      <RealtimeUpdates />

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            Built with Appwrite for Hacktoberfest 2024 • Connecting communities in times of need
          </p>
        </div>
      </footer>
    </div>
  );
}


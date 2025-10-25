'use client';

import { useState, useEffect } from 'react';
import { account } from '@/lib/appwrite';
import { DatabaseService } from '@/lib/database';
import { UserProfile } from '@/types';
import toast from 'react-hot-toast';
import { GlassButton, GlassInput, GlassCard } from '@/components/ui/glass-components';
import { BlurFade } from '@/components/ui/blur-fade';
import { User, Mail, Shield, RefreshCw } from 'lucide-react';

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
      
      let phoneValue = user.phone || 'N/A';
      if (phoneValue.length > 20) {
        phoneValue = phoneValue.substring(0, 20);
      }
      
      const newProfile = await DatabaseService.createUserProfile(
        user.$id,
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
    } finally {
      setIsLoading(false);
    }
  };

  if (!isEditing && profile) {
    return (
      <GlassCard className="max-w-2xl mx-auto">
        <BlurFade>
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-3xl font-bold text-foreground">Your Profile</h2>
            <GlassButton size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </GlassButton>
          </div>
        </BlurFade>

        <div className="space-y-6">
          <BlurFade delay={0.1}>
            <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30">
              <User className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div className="flex-1">
                <label className="text-sm font-medium text-muted-foreground block mb-1">Name</label>
                <p className="text-lg font-medium text-foreground">{profile.name}</p>
              </div>
            </div>
          </BlurFade>

          <BlurFade delay={0.2}>
            <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30">
              <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div className="flex-1">
                <label className="text-sm font-medium text-muted-foreground block mb-1">Contact</label>
                <p className="text-lg font-medium text-foreground">
                  {profile.phone === 'N/A' ? 'Email Account' : profile.phone}
                </p>
              </div>
            </div>
          </BlurFade>

          <BlurFade delay={0.3}>
            <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30">
              <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div className="flex-1">
                <label className="text-sm font-medium text-muted-foreground block mb-1">Role</label>
                <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${
                  profile.role === 'HELPER' ? 'bg-green-500/20 text-green-400' :
                  profile.role === 'SEEKER' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-purple-500/20 text-purple-400'
                }`}>
                  {profile.role}
                </span>
              </div>
            </div>
          </BlurFade>

          <BlurFade delay={0.4}>
            <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30">
              <RefreshCw className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div className="flex-1">
                <label className="text-sm font-medium text-muted-foreground block mb-1">Verification Status</label>
                <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${
                  profile.isVerified ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {profile.isVerified ? '✓ Verified' : 'Pending Verification'}
                </span>
                {!profile.isVerified && authUser && authUser.emailVerification === false && (
                  <button
                    onClick={handleResendVerification}
                    className="mt-2 text-sm text-primary hover:underline block"
                  >
                    Resend verification email
                  </button>
                )}
              </div>
            </div>
          </BlurFade>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="max-w-2xl mx-auto">
      <BlurFade>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          {profile ? 'Edit Profile' : 'Complete Your Profile'}
        </h2>
        <p className="text-muted-foreground mb-8">
          {profile ? 'Update your information' : 'Tell us a bit about yourself'}
        </p>
      </BlurFade>

      <form onSubmit={handleSubmit} className="space-y-6">
        <BlurFade delay={0.1}>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Full Name
            </label>
            <GlassInput
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              icon={<User className="w-5 h-5 text-foreground/60" />}
              required
            />
          </div>
        </BlurFade>

        <BlurFade delay={0.2}>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              I want to
            </label>
            <div className="grid grid-cols-2 gap-4">
              {(['HELPER', 'SEEKER'] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setFormData({ ...formData, role })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.role === role
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border/50 bg-muted/30 text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  <div className="font-medium">{role === 'HELPER' ? 'Help Others' : 'Seek Help'}</div>
                  <div className="text-xs mt-1 opacity-80">
                    {role === 'HELPER' ? 'Offer resources' : 'Request assistance'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </BlurFade>

        <BlurFade delay={0.3}>
          <GlassButton
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-foreground mx-auto" />
            ) : profile ? 'Update Profile' : 'Create Profile'}
          </GlassButton>
        </BlurFade>

        {profile && (
          <BlurFade delay={0.4}>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </BlurFade>
        )}
      </form>
    </GlassCard>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { account } from '@/lib/appwrite';
import { ID } from 'appwrite';
import toast from 'react-hot-toast';
import { GlassButton, GlassInput } from '@/components/ui/glass-components';
import { Mail, Lock, Eye, EyeOff, User as UserIcon, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlurFade } from '@/components/ui/blur-fade';
import { cn } from '@/lib/utils';

export default function AuthButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
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
      await account.create(ID.unique(), email, password, name);
      await account.createEmailPasswordSession(email, password);
      
      try {
        const verificationUrl = `${window.location.origin}/verify`;
        await account.createVerification(verificationUrl);
        toast.success('Account created! Please check your email to verify your account.');
      } catch {
        toast.success('Account created successfully!');
      }
      
      const currentUser = await account.get();
      setUser(currentUser);
      setShowAuthModal(false);
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
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
      setShowAuthModal(false);
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  if (user) return null;

  return (
    <>
      <GlassButton onClick={() => setShowAuthModal(true)} size="sm">
        Get Started
      </GlassButton>

      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowAuthModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative backdrop-blur-md bg-card/90 border-2 border-border/50 rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
              <BlurFade>
                <h2 className="text-3xl font-bold text-foreground mb-2 text-center">
                  {isSignUp ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="text-muted-foreground text-center mb-8">
                  {isSignUp ? 'Join our community of helpers' : 'Sign in to continue'}
                </p>
              </BlurFade>

              <form onSubmit={isSignUp ? handleEmailSignUp : handleEmailSignIn} className="space-y-4">
                {isSignUp && (
                  <BlurFade delay={0.1}>
                    <GlassInput
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      icon={<UserIcon className="w-5 h-5 text-foreground/60" />}
                      required
                    />
                  </BlurFade>
                )}

                <BlurFade delay={isSignUp ? 0.2 : 0.1}>
                  <GlassInput
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail className="w-5 h-5 text-foreground/60" />}
                    required
                  />
                </BlurFade>

                <BlurFade delay={isSignUp ? 0.3 : 0.2}>
                  <GlassInput
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<Lock className="w-5 h-5 text-foreground/60" />}
                    endIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-foreground/60 hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    }
                    required
                  />
                </BlurFade>

                <BlurFade delay={isSignUp ? 0.4 : 0.3}>
                  <GlassButton
                    type="submit"
                    className="w-full mt-6"
                    disabled={isLoading}
                    contentClassName="flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-foreground" />
                    ) : (
                      <>
                        {isSignUp ? 'Create Account' : 'Sign In'}
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </GlassButton>
                </BlurFade>

                <BlurFade delay={isSignUp ? 0.5 : 0.4}>
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                      type="button"
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-primary hover:underline font-medium"
                    >
                      {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                  </p>
                </BlurFade>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

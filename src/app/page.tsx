'use client';

import { useState, useEffect } from 'react';
import { account } from '@/lib/appwrite';
import { ID } from 'appwrite';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { GlassButton, GlassInput } from '@/components/ui/glass-components';
import { GradientBackground } from '@/components/ui/gradient-background';
import { BlurFade } from '@/components/ui/blur-fade';
import { cn } from '@/lib/utils';
import { Heart, Shield, Users, Zap, Menu, X, User, Home, AlertCircle, Package, Activity, Mail, Lock, Eye, EyeOff, User as UserIcon, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import existing components
import UserProfile from '@/components/UserProfile';
import EmergencyRequestForm from '@/components/EmergencyRequestForm';
import ResourceForm from '@/components/ResourceForm';
import ResourceMatcher from '@/components/ResourceMatcher';
import RealtimeUpdates from '@/components/RealtimeUpdates';

const Logo = () => (
  <div className="bg-primary text-primary-foreground rounded-md p-1.5">
    <Heart className="h-5 w-5" />
  </div>
);

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'request' | 'offer' | 'profile'>('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

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

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
      setActiveTab('dashboard');
    } catch (error) {
      console.error('Logout error:', error);
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
      setAuthLoading(true);
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
      setAuthLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    try {
      setAuthLoading(true);
      await account.createEmailPasswordSession(email, password);
      const currentUser = await account.get();
      setUser(currentUser);
      toast.success('Signed in successfully!');
      setShowAuthModal(false);
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || 'Invalid credentials');
    } finally {
      setAuthLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-background relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <GradientBackground />
        </div>
        <BlurFade className="relative z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
            <p className="text-foreground/80 text-lg font-medium">Loading LocalAid Connect...</p>
          </div>
        </BlurFade>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen w-screen bg-background relative overflow-hidden">
        <Toaster position="top-right" />
        <div className="absolute inset-0 z-0">
          <GradientBackground />
        </div>

        {/* Header */}
        <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-card/30 border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Logo />
                <h1 className="text-xl font-bold text-foreground">LocalAid Connect</h1>
              </div>
              <GlassButton onClick={() => setShowAuthModal(true)} size="sm">
                Get Started
              </GlassButton>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative z-10 pt-32 pb-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <BlurFade delay={0.2}>
              <h1 className="font-serif font-light text-5xl sm:text-6xl md:text-7xl tracking-tight text-foreground mb-6">
                Connect Communities
                <br />
                <span className="text-primary">in Times of Need</span>
              </h1>
            </BlurFade>

            <BlurFade delay={0.4}>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
                Real-time platform connecting people seeking help with local volunteers during emergencies. 
                Because every second counts when communities come together.
              </p>
            </BlurFade>

            <BlurFade delay={0.6}>
              <div className="flex flex-wrap gap-4 justify-center">
                <GlassButton size="lg" onClick={() => setShowAuthModal(true)} contentClassName="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Get Started
                </GlassButton>
                <GlassButton size="lg" onClick={() => {
                  document.querySelector('.max-w-7xl.mt-32')?.scrollIntoView({ behavior: 'smooth' });
                }} contentClassName="flex items-center gap-2">
                  Learn More
                </GlassButton>
              </div>
            </BlurFade>
          </div>

          {/* Features Grid */}
          <div className="max-w-7xl mx-auto mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            {[
              { icon: <Zap className="w-8 h-8" />, title: "Real-Time Matching", desc: "Instant connections based on proximity and needs" },
              { icon: <Shield className="w-8 h-8" />, title: "Secure Platform", desc: "Email verification and trusted community" },
              { icon: <Users className="w-8 h-8" />, title: "Community Driven", desc: "Local heroes helping neighbors in crisis" },
              { icon: <Activity className="w-8 h-8" />, title: "Live Updates", desc: "Stay informed with real-time notifications" }
            ].map((feature, i) => (
              <BlurFade key={i} delay={0.8 + i * 0.1}>
                <div className="relative backdrop-blur-md bg-card/50 border-2 border-border/50 rounded-2xl p-6 hover:bg-card/70 transition-all group">
                  <div className="text-primary mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>

        {/* Auth Modal for Landing Page */}
        <AnimatePresence>
          {showAuthModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              onClick={() => setShowAuthModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="relative backdrop-blur-xl bg-card/95 border-2 border-border/50 rounded-3xl p-8 w-full max-w-md shadow-2xl"
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
                      disabled={authLoading}
                      contentClassName="flex items-center justify-center gap-2"
                    >
                      {authLoading ? (
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
      </div>
    );
  }

  // Logged In View
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-4 h-4" /> },
    { id: 'request', label: 'Request Help', icon: <AlertCircle className="w-4 h-4" /> },
    { id: 'offer', label: 'Offer Resources', icon: <Package className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen w-screen bg-background relative overflow-hidden">
      <Toaster position="top-right" />
      <div className="absolute inset-0 z-0 opacity-30">
        <GradientBackground />
      </div>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-card/80 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo />
              <h1 className="text-xl font-bold text-foreground hidden sm:block">LocalAid Connect</h1>
            </div>

            {/* Desktop Tabs */}
            <div className="hidden md:flex items-center gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                    activeTab === tab.id
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Mobile Menu Button & Logout */}
            <div className="flex items-center gap-2">
              <GlassButton size="sm" onClick={handleLogout}>
                Logout
              </GlassButton>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-foreground"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden overflow-hidden"
              >
                <div className="py-4 space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as any);
                        setMobileMenuOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                        activeTab === tab.id
                          ? "bg-primary/20 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'dashboard' && (
                <div className="space-y-8">
                  <BlurFade>
                    <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
                    <p className="text-muted-foreground">Real-time emergency requests and available resources</p>
                  </BlurFade>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <BlurFade delay={0.1}>
                        <ResourceMatcher />
                      </BlurFade>
                    </div>
                    <div>
                      <BlurFade delay={0.2}>
                        <RealtimeUpdates />
                      </BlurFade>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'request' && (
                <div className="max-w-3xl mx-auto">
                  <BlurFade>
                    <EmergencyRequestForm />
                  </BlurFade>
                </div>
              )}

              {activeTab === 'offer' && (
                <div className="max-w-3xl mx-auto">
                  <BlurFade>
                    <ResourceForm />
                  </BlurFade>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="max-w-2xl mx-auto">
                  <BlurFade>
                    <UserProfile />
                  </BlurFade>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowAuthModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative backdrop-blur-xl bg-card/95 border-2 border-border/50 rounded-3xl p-8 w-full max-w-md shadow-2xl"
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
                    disabled={authLoading}
                    contentClassName="flex items-center justify-center gap-2"
                  >
                    {authLoading ? (
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
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { client } from '@/lib/appwrite';
import { GlassCard } from '@/components/ui/glass-components';
import { BlurFade } from '@/components/ui/blur-fade';
import { Bell, Activity, CheckCircle, AlertCircle, Package, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

type Notification = {
  id: string;
  type: 'request' | 'resource' | 'match';
  message: string;
  timestamp: Date;
  icon: React.ReactNode;
  color: string;
};

export default function RealtimeUpdates() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    try {
      const unsubscribe = client.subscribe(
        [
          `databases.${DATABASE_ID}.collections.requests.documents`,
          `databases.${DATABASE_ID}.collections.resources.documents`,
          `databases.${DATABASE_ID}.collections.matches.documents`,
        ],
        (response) => {
          setIsConnected(true);

          const event = response.events[0];
          let notification: Notification | null = null;

          if (event?.includes('requests')) {
            if (event.includes('create')) {
              notification = {
                id: Date.now().toString(),
                type: 'request',
                message: 'New emergency request created',
                timestamp: new Date(),
                icon: <AlertCircle className="w-4 h-4" />,
                color: 'bg-red-500/20 text-red-400 border-red-500/30',
              };
            }
          } else if (event?.includes('resources')) {
            if (event.includes('create')) {
              notification = {
                id: Date.now().toString(),
                type: 'resource',
                message: 'New resource available',
                timestamp: new Date(),
                icon: <Package className="w-4 h-4" />,
                color: 'bg-green-500/20 text-green-400 border-green-500/30',
              };
            }
          } else if (event?.includes('matches')) {
            if (event.includes('create')) {
              notification = {
                id: Date.now().toString(),
                type: 'match',
                message: 'New match created',
                timestamp: new Date(),
                icon: <CheckCircle className="w-4 h-4" />,
                color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
              };
            }
          }

          if (notification) {
            setNotifications((prev) => [notification!, ...prev].slice(0, 10));
          }
        }
      );

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error('Realtime subscription error:', error);
      setIsConnected(false);
    }
  }, []);

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <GlassCard className="h-fit sticky top-24">
      <BlurFade>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Live Updates</h3>
              <p className="text-xs text-muted-foreground">Real-time activity</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isConnected ? "bg-green-400 animate-pulse" : "bg-red-400"
            )} />
            <span className="text-xs text-muted-foreground">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </BlurFade>

      <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {notifications.length === 0 ? (
            <BlurFade key="empty" delay={0.1}>
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Waiting for updates...
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  You'll see live notifications here
                </p>
              </div>
            </BlurFade>
          ) : (
            notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
              >
                <div className={cn(
                  "p-3 rounded-xl border-2 transition-all",
                  notification.color
                )}>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {notification.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {getTimeAgo(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {notifications.length > 0 && (
        <BlurFade delay={0.2}>
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {notifications.length} recent updates
              </span>
              <button
                onClick={() => setNotifications([])}
                className="text-primary hover:underline"
              >
                Clear all
              </button>
            </div>
          </div>
        </BlurFade>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: oklch(from var(--border) l c h / 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: oklch(from var(--border) l c h / 0.7);
        }
      `}</style>
    </GlassCard>
  );
}

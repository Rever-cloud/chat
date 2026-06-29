'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Settings, LogOut, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    router.push('/login');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-neonred" />
      </div>
    );
  }

  if (!user) return null;

  const quickActions = [
    {
      icon: <MessageSquare size={20} />,
      title: 'New Chat',
      desc: 'Start a conversation with Reverse AI',
      onClick: () => router.push('/chat'),
      color: 'text-neonred',
    },
    {
      icon: <Clock size={20} />,
      title: 'Recent Chats',
      desc: 'Continue your previous conversations',
      onClick: () => router.push('/chat'),
      color: 'text-blue-400',
    },
    {
      icon: <Settings size={20} />,
      title: 'Settings',
      desc: 'Manage your account and preferences',
      onClick: () => router.push('/settings'),
      color: 'text-gray-400',
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-neonred/20 flex items-center justify-center glow-pulse">
                <span className="text-3xl font-bold text-neonred">R</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Dashboard</h1>
                <p className="text-sm text-gray-500">
                  Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/chat')}
                className="btn-neon px-4 py-2 text-sm flex items-center gap-2"
              >
                <MessageSquare size={14} />
                Go to Chat
                <ArrowRight size={14} />
              </button>
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
              >
                {signingOut ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h2 className="text-sm font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (i + 1) }}
                onClick={action.onClick}
                className="glass-card p-5 text-left hover:border-neonred/30 transition-all group"
              >
                <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center ${action.color} mb-3 group-hover:bg-neonred/10 transition-colors`}>
                  {action.icon}
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">{action.title}</h3>
                <p className="text-gray-500 text-xs">{action.desc}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h2 className="text-sm font-semibold text-white mb-4">Account</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-sm text-gray-400">Email</span>
              <span className="text-sm text-gray-300">{user.email}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-sm text-gray-400">Name</span>
              <span className="text-sm text-gray-300">{user.user_metadata?.full_name || 'Not set'}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-400">Member since</span>
              <span className="text-sm text-gray-300">
                {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

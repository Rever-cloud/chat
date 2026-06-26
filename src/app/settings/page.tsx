'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Lock, LogOut, Info, Shield, Palette } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleChangePassword = async () => {
    if (!user?.email) return;
    setPasswordLoading(true);
    setPasswordMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email);
      if (error) {
        setPasswordMessage(error.message);
      } else {
        setPasswordMessage('Password reset link sent to your email');
      }
    } catch {
      setPasswordMessage('Failed to send reset link');
    }
    setPasswordLoading(false);
  };

  if (loading) return null;
  if (!user) return null;

  const sections = [
    {
      title: 'Account',
      icon: <User size={16} />,
      items: [
        { label: 'Email', value: user.email || '', icon: <Mail size={14} />, action: null },
        {
          label: 'Change Password',
          value: '',
          icon: <Lock size={14} />,
          action: handleChangePassword,
          loading: passwordLoading,
          message: passwordMessage,
        },
      ],
    },
    {
      title: 'Preferences',
      icon: <Palette size={16} />,
      items: [
        { label: 'Theme', value: 'Dark Mode', icon: <Palette size={14} />, action: null },
      ],
    },
    {
      title: 'About',
      icon: <Info size={16} />,
      items: [
        { label: 'Version', value: '1.0.0', icon: <Info size={14} />, action: null },
        { label: 'Privacy Policy', value: '', icon: <Shield size={14} />, action: null },
      ],
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.push('/chat')}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-6 text-sm"
        >
          <ArrowLeft size={16} />
          Back to Chat
        </button>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-neonred/20 flex items-center justify-center">
              <span className="text-3xl font-bold text-neonred">R</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Settings</h1>
              <p className="text-sm text-gray-500">Manage your account and preferences</p>
            </div>
          </div>
        </motion.div>

        {sections.map((section, si) => (
          <motion.div
            key={si}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: si * 0.1 }}
            className="glass-card p-6 mb-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-neonred">{section.icon}</span>
              <h2 className="text-sm font-semibold text-white">{section.title}</h2>
            </div>
            <div className="space-y-3">
              {section.items.map((item, ii) => (
                <div key={ii} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">{item.icon}</span>
                    <span className="text-sm text-gray-300">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.value && (
                      <span className="text-xs text-gray-600">{item.value}</span>
                    )}
                    {item.action && (
                      <button
                        onClick={item.action}
                        disabled={item.loading}
                        className="text-xs px-3 py-1.5 rounded-lg bg-neonred/10 text-neonred hover:bg-neonred/20 transition-colors disabled:opacity-50"
                      >
                        {item.loading ? 'Sending...' : 'Update'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {passwordMessage && (
                <p className={`text-xs mt-2 ${passwordMessage.includes('sent') ? 'text-green-400' : 'text-red-400'}`}>
                  {passwordMessage}
                </p>
              )}
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <button
            onClick={signOut}
            className="w-full glass-card p-4 flex items-center justify-center gap-2 text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={16} />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}

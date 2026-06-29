'use client';
export const dynamic = 'force-dynamic';

import { motion } from 'framer-motion';
import { Sparkles, MessageSquare, Zap, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const features = [
    {
      icon: <MessageSquare size={20} />,
      title: 'AI Conversations',
      desc: 'Engage in natural, intelligent conversations with Reverse AI powered by advanced language models.',
    },
    {
      icon: <Zap size={20} />,
      title: 'Lightning Fast',
      desc: 'Get responses in real-time with streaming AI that thinks as it speaks.',
    },
    {
      icon: <Shield size={20} />,
      title: 'Private & Secure',
      desc: 'Your conversations are encrypted and protected. We never share your data.',
    },
    {
      icon: <Sparkles size={20} />,
      title: 'Smart Assistance',
      desc: 'From coding to creative writing, Reverse AI helps you accomplish more.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[rgba(255,30,30,0.1)]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-neonred/20 flex items-center justify-center">
              <span className="text-neonred font-bold text-lg">R</span>
            </div>
            <span className="text-white font-semibold">Reverse AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-gray-400 hover:text-white px-4 py-2 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="btn-neon text-sm px-5 py-2 flex items-center gap-2"
            >
              Get Started
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neonred/10 border border-neonred/20 text-neonred text-xs mb-6">
              <Sparkles size={12} />
              <span>Powered by advanced AI</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            The Future of AI
            <br />
            <span className="text-neonred">Is Here</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto mb-10"
          >
            Experience the next generation of AI conversation. Built by{' '}
            <span className="text-neonred font-semibold">UNRULYREVERSE</span> — 
            Reverse AI understands, creates, and assists like never before.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex items-center justify-center gap-4"
          >
            <Link
              href="/signup"
              className="btn-neon px-8 py-3 text-sm font-medium flex items-center gap-2"
            >
              Start Chatting
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/login"
              className="text-sm text-gray-400 hover:text-white px-8 py-3 rounded-lg border border-white/10 hover:border-white/20 transition-all"
            >
              Sign In
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Glowing R Logo Centerpiece */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="flex justify-center mb-20"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-neonred/20 rounded-full blur-3xl" />
          <div className="w-32 h-32 rounded-full bg-neonred/10 flex items-center justify-center glow-pulse relative z-10">
            <span className="text-7xl font-bold text-neonred">R</span>
          </div>
        </div>
      </motion.div>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-2xl font-bold text-white text-center mb-12"
        >
          Why Choose{' '}
          <span className="text-neonred">Reverse AI</span>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 hover:border-neonred/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-neonred/10 flex items-center justify-center text-neonred mb-4 group-hover:bg-neonred/20 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-white font-semibold text-sm mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="glass-card p-12 text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to experience{' '}
            <span className="text-neonred">Reverse AI</span>?
          </h2>
          <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
            Join the future of AI conversations. Created by UNRULYREVERSE.
          </p>
          <Link
            href="/signup"
            className="btn-neon px-8 py-3 text-sm font-medium inline-flex items-center gap-2"
          >
            Get Started Free
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[rgba(255,30,30,0.1)] py-8 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-neonred/20 flex items-center justify-center">
              <span className="text-neonred font-bold text-xs">R</span>
            </div>
            <span className="text-gray-600 text-xs">2026 Reverse AI. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-xs">Created by UNRULYREVERSE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

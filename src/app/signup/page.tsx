'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const passwordChecks = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
    passwordsMatch: password === confirmPassword && confirmPassword.length > 0,
  };

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isPasswordValid) {
      setError('Please meet all password requirements');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      router.push('/login');
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const CheckItem = ({ passed, label }: { passed: boolean; label: string }) => (
    <div className="flex items-center gap-1.5">
      {passed ? (
        <CheckCircle size={10} className="text-green-400" />
      ) : (
        <XCircle size={10} className="text-gray-600" />
      )}
      <span className={`text-[10px] ${passed ? 'text-green-400' : 'text-gray-500'}`}>{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center mb-10"
        >
          <div className="w-20 h-20 rounded-full bg-neonred/10 flex items-center justify-center glow-pulse mb-4">
            <span className="text-5xl font-bold text-neonred">R</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Reverse AI</h1>
          <p className="text-sm text-gray-500 mt-1">Create your account</p>
        </motion.div>

        {/* Signup Card */}
        <div className="glass-card p-8">
          <h2 className="text-lg font-semibold text-white mb-6">Get started</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Full name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="input-glass w-full pl-10 pr-4 py-3 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-glass w-full pl-10 pr-4 py-3 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="input-glass w-full pl-10 pr-10 py-3 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2 grid grid-cols-2 gap-1"
                >
                  <CheckItem passed={passwordChecks.minLength} label="8+ characters" />
                  <CheckItem passed={passwordChecks.hasUpper} label="Uppercase" />
                  <CheckItem passed={passwordChecks.hasLower} label="Lowercase" />
                  <CheckItem passed={passwordChecks.hasNumber} label="Number" />
                  <CheckItem passed={passwordChecks.hasSpecial} label="Special char" />
                  <CheckItem passed={passwordChecks.passwordsMatch} label="Passwords match" />
                </motion.div>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Confirm password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="input-glass w-full pl-10 pr-10 py-3 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-xs"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading || (password.length > 0 && !isPasswordValid)}
              className="btn-neon w-full flex items-center justify-center gap-2 py-3 text-sm font-medium"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="text-neonred hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          By continuing, you agree to Reverse AI Terms of Service
        </p>
      </motion.div>
    </div>
  );
}

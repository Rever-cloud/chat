'use client';
export const dynamic = 'force-dynamic';

import { useState, useRef, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function OTPForm() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const supabase = createClient();

  useEffect(() => {
    if (!email) {
      router.push('/');
    }
  }, [email, router]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    pasted.split('').forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter the full 6-digit code');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'email',
      });

      if (verifyError) {
        setError(verifyError.message);
        setLoading(false);
        return;
      }

      setVerified(true);
      setTimeout(() => {
        router.push('/chat');
      }, 1500);
    } catch {
      setError('Verification failed. Please try again.');
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setLoading(true);
    try {
      const { error: resendError } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      });
      if (resendError) setError(resendError.message);
    } catch {
      setError('Failed to resend code');
    }
    setLoading(false);
  };

  if (!email) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 text-sm"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-neonred/20 flex items-center justify-center">
              <span className="text-neonred font-bold text-xl">R</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Check your email</h2>
              <p className="text-xs text-gray-500">We sent a code to {email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="otp-input"
                  disabled={loading || verified}
                />
              ))}
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-xs text-center mb-4"
              >
                {error}
              </motion.p>
            )}

            {verified ? (
              <div className="flex items-center justify-center gap-2 text-green-400 text-sm py-3">
                <CheckCircle size={16} />
                Verified! Redirecting...
              </div>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="btn-neon w-full flex items-center justify-center gap-2 py-3 text-sm font-medium"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  'Verify Code'
                )}
              </button>
            )}
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={handleResend}
              disabled={loading}
              className="text-sm text-gray-500 hover:text-neonred transition-colors"
            >
              Didn&apos;t receive a code? Resend
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function OTPPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-neonred" />
      </div>
    }>
      <OTPForm />
    </Suspense>
  );
}

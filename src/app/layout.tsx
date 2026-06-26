import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import FuturisticBackground from '@/components/FuturisticBackground';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RVerse AI - Next Generation AI Platform',
  description: 'Experience the future of AI with RVerse AI',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <FuturisticBackground />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

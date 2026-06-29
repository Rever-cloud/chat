import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import FuturisticBackground from '@/components/FuturisticBackground';

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
      <body className="font-sans">
        <AuthProvider>
          <FuturisticBackground />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

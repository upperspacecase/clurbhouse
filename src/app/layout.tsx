import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'House of Clubs — Discover & Join Clubs in Your City',
  description:
    'Your local club marketplace. Sports, arts, tech, social — browse, join, and manage memberships. Like a farmer\'s market for clubs.',
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
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Toaster position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  );
}

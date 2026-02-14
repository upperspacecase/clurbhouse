import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Clurbhouse — Discover & Join Clubs Near You',
  description:
    'Find every club in your area. Sports, arts, tech, social — one-click join, zero cost. Like clubs day, but every day.',
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

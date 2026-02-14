'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import ClubCard from '@/components/ClubCard';

interface Club {
  _id: string;
  slug: string;
  name: string;
  shortPitch: string;
  category: string;
  imageUrl: string;
  location: { city: string; state: string };
  memberCount: number;
  tags: string[];
  plan: string;
  isVerified: boolean;
}

interface DashboardData {
  joinedClubs: Club[];
  createdClubs: Club[];
}

export default function DashboardPage() {
  const { user, getIdToken, loading: authLoading } = useAuth();
  const [data, setData] = useState<DashboardData>({
    joinedClubs: [],
    createdClubs: [],
  });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'joined' | 'created'>('joined');

  useEffect(() => {
    async function fetchDashboard() {
      if (!user) return;
      try {
        const token = await getIdToken();
        const res = await fetch('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        setData({
          joinedClubs: result.joinedClubs || [],
          createdClubs: result.createdClubs || [],
        });
      } catch {
        // Failed to fetch
      } finally {
        setLoading(false);
      }
    }
    if (user) fetchDashboard();
    else if (!authLoading) setLoading(false);
  }, [user, authLoading, getIdToken]);

  if (!authLoading && !user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Sign in to see your clubs
        </h1>
        <p className="text-gray-600 mb-6">
          Your dashboard shows clubs you&apos;ve joined and created.
        </p>
        <Link
          href="/auth/login"
          className="inline-flex items-center px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors"
        >
          Log In
        </Link>
      </div>
    );
  }

  const clubs = tab === 'joined' ? data.joinedClubs : data.createdClubs;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Clubs</h1>
          <p className="text-gray-600 mt-1">
            Manage clubs you&apos;ve joined and created.
          </p>
        </div>
        <Link
          href="/clubs/create"
          className="inline-flex items-center px-4 py-2.5 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition-colors text-sm"
        >
          + Create Club
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setTab('joined')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === 'joined'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Joined ({data.joinedClubs.length})
        </button>
        <button
          onClick={() => setTab('created')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === 'created'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Created ({data.createdClubs.length})
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse"
            >
              <div className="h-40 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-100 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : clubs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <ClubCard key={club._id} club={club} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="text-5xl mb-4">
            {tab === 'joined' ? '\u{1F50D}' : '\u{1F3D7}'}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {tab === 'joined'
              ? "You haven't joined any clubs yet"
              : "You haven't created any clubs yet"}
          </h3>
          <p className="text-gray-600 mb-6">
            {tab === 'joined'
              ? 'Have a look around and see what catches your eye.'
              : 'Get your club listed and let people find you.'}
          </p>
          <Link
            href={tab === 'joined' ? '/discover' : '/clubs/create'}
            className="inline-flex items-center px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors"
          >
            {tab === 'joined' ? 'Discover Clubs' : 'Create a Club'}
          </Link>
        </div>
      )}
    </div>
  );
}

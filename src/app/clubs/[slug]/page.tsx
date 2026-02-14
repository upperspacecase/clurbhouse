'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import toast from 'react-hot-toast';

interface Club {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortPitch: string;
  category: string;
  tags: string[];
  location: { city: string; state: string; country: string };
  imageUrl: string;
  bannerUrl: string;
  createdBy: string;
  memberCount: number;
  maxMembers: number | null;
  meetingSchedule: string;
  contactEmail: string;
  website: string;
  socials: {
    instagram?: string;
    twitter?: string;
    discord?: string;
    facebook?: string;
  };
  isVerified: boolean;
  createdAt: string;
}

export default function ClubDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { user, getIdToken } = useAuth();

  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    async function fetchClub() {
      try {
        const headers: Record<string, string> = {};
        if (user) {
          const token = await getIdToken();
          if (token) headers['Authorization'] = `Bearer ${token}`;
        }
        const res = await fetch(`/api/clubs/${slug}`, { headers });
        if (!res.ok) throw new Error('Club not found');
        const data = await res.json();
        setClub(data.club);
        setIsMember(data.isMember || false);
      } catch {
        setClub(null);
      } finally {
        setLoading(false);
      }
    }
    fetchClub();
  }, [slug, user, getIdToken]);

  const handleJoin = async () => {
    if (!user) {
      toast.error('Please sign in to join a club');
      return;
    }
    setJoining(true);
    try {
      const token = await getIdToken();
      const res = await fetch(`/api/clubs/${slug}/join`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setIsMember(true);
      setClub((prev) => prev ? { ...prev, memberCount: prev.memberCount + 1 } : prev);
      toast.success('You\'re in');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to join');
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!user) return;
    setJoining(true);
    try {
      const token = await getIdToken();
      const res = await fetch(`/api/clubs/${slug}/join`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      setIsMember(false);
      setClub((prev) => prev ? { ...prev, memberCount: Math.max(0, prev.memberCount - 1) } : prev);
      toast.success('You left the club');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to leave');
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-64 bg-gray-200 rounded-xl" />
          <div className="h-8 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-100 rounded w-3/4" />
          <div className="h-4 bg-gray-100 rounded w-full" />
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Club not found
        </h1>
        <p className="text-gray-600 mb-6">
          This club may have been removed or the link is incorrect.
        </p>
        <Link
          href="/discover"
          className="text-brand-600 font-medium hover:text-brand-700"
        >
          Back to Discover
        </Link>
      </div>
    );
  }

  const isOwner = user?.uid === club.createdBy;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Banner */}
      <div className="h-64 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl overflow-hidden mb-8 relative">
        {club.bannerUrl ? (
          <img
            src={club.bannerUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-8xl font-bold text-white/20">
              {club.name[0]}
            </span>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{club.name}</h1>
              {club.isVerified && (
                <span className="inline-flex items-center gap-1 text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full text-sm font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              )}
            </div>
            <p className="text-lg text-gray-600">{club.shortPitch}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">About</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {club.description}
            </p>
          </div>

          {club.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {club.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Join / Leave */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {isOwner ? (
              <div className="text-center">
                <span className="text-sm text-gray-500 font-medium">
                  You own this club
                </span>
              </div>
            ) : isMember ? (
              <button
                onClick={handleLeave}
                disabled={joining}
                className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {joining ? 'Leaving...' : 'Leave Club'}
              </button>
            ) : (
              <button
                onClick={handleJoin}
                disabled={joining}
                className="w-full py-3 px-4 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50"
              >
                {joining ? 'Joining...' : 'Join Club'}
              </button>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Members</span>
                <span className="font-semibold text-gray-900">
                  {club.memberCount}
                  {club.maxMembers ? ` / ${club.maxMembers}` : ''}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Category</span>
                <span className="font-semibold text-gray-900">
                  {club.category}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Location</span>
                <span className="font-semibold text-gray-900">
                  {club.location.city}, {club.location.state}
                </span>
              </div>
              {club.meetingSchedule && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Meets</span>
                  <span className="font-semibold text-gray-900">
                    {club.meetingSchedule}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Contact & Socials */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
            {club.contactEmail && (
              <a
                href={`mailto:${club.contactEmail}`}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {club.contactEmail}
              </a>
            )}
            {club.website && (
              <a
                href={club.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Website
              </a>
            )}
            {Object.entries(club.socials || {}).map(
              ([platform, handle]) =>
                handle && (
                  <div
                    key={platform}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <span className="capitalize">{platform}:</span>
                    <span className="font-medium">{handle}</span>
                  </div>
                )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

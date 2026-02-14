'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import ClubCard from '@/components/ClubCard';

const CATEGORIES = [
  'All',
  'Sports & Fitness',
  'Arts & Culture',
  'Technology',
  'Music',
  'Gaming',
  'Social',
  'Academic',
  'Outdoors & Adventure',
  'Food & Drink',
  'Business & Networking',
  'Volunteering',
  'Health & Wellness',
];

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

function DiscoverContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [city, setCity] = useState('');

  const fetchClubs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (category && category !== 'All') params.set('category', category);
    if (city) params.set('city', city);

    try {
      const res = await fetch(`/api/clubs?${params.toString()}`);
      const data = await res.json();
      setClubs(data.clubs || []);
    } catch {
      setClubs([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, city]);

  useEffect(() => {
    const debounce = setTimeout(fetchClubs, 300);
    return () => clearTimeout(debounce);
  }, [fetchClubs]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Discover Clubs
        </h1>
        <p className="text-gray-600">
          See what&apos;s happening near you.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search clubs by name, description, or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors"
            />
          </div>
          <input
            type="text"
            placeholder="City..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="sm:w-48 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors"
          />
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === cat
                  ? 'bg-brand-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse"
            >
              <div className="h-40 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
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
        <div className="text-center py-20">
          <div className="text-6xl mb-4">&#128269;</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No clubs found
          </h3>
          <p className="text-gray-600 mb-6">
            {search || category !== 'All' || city
              ? 'Try adjusting your filters or search terms.'
              : 'Be the first to create a club in your area!'}
          </p>
          <a
            href="/clubs/create"
            className="inline-flex items-center px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors"
          >
            Create a Club
          </a>
        </div>
      )}
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-48" />
            <div className="h-12 bg-gray-100 rounded" />
          </div>
        </div>
      }
    >
      <DiscoverContent />
    </Suspense>
  );
}

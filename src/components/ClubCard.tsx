'use client';

import Link from 'next/link';

interface ClubCardProps {
  club: {
    _id: string;
    slug: string;
    name: string;
    shortPitch: string;
    category: string;
    imageUrl: string;
    location: { city: string; state: string };
    memberCount: number;
    tags: string[];
    isVerified: boolean;
  };
}

const categoryColors: Record<string, string> = {
  'Sports & Fitness': 'bg-green-100 text-green-700',
  'Arts & Culture': 'bg-purple-100 text-purple-700',
  Technology: 'bg-blue-100 text-blue-700',
  Music: 'bg-pink-100 text-pink-700',
  Gaming: 'bg-red-100 text-red-700',
  Social: 'bg-yellow-100 text-yellow-700',
  Academic: 'bg-indigo-100 text-indigo-700',
  'Outdoors & Adventure': 'bg-emerald-100 text-emerald-700',
  'Food & Drink': 'bg-orange-100 text-orange-700',
  'Business & Networking': 'bg-slate-100 text-slate-700',
  Volunteering: 'bg-teal-100 text-teal-700',
  'Health & Wellness': 'bg-cyan-100 text-cyan-700',
  Other: 'bg-gray-100 text-gray-700',
};

export default function ClubCard({ club }: ClubCardProps) {
  return (
    <Link href={`/clubs/${club.slug}`}>
      <div className="bg-white rounded-xl border border-gray-200 hover:border-brand-300 hover:shadow-lg transition-all duration-200 overflow-hidden group cursor-pointer h-full flex flex-col">
        {/* Image */}
        <div className="h-40 bg-gradient-to-br from-brand-400 to-brand-600 relative overflow-hidden">
          {club.imageUrl ? (
            <img
              src={club.imageUrl}
              alt={club.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl font-bold text-white/30">
                {club.name[0]}
              </span>
            </div>
          )}
          {club.isVerified && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-medium text-brand-600 flex items-center gap-1">
              <svg
                className="w-3 h-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Verified
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1">
              {club.name}
            </h3>
          </div>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
            {club.shortPitch}
          </p>

          <div className="flex items-center gap-2 mb-3">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[club.category] || 'bg-gray-100 text-gray-700'}`}
            >
              {club.category}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
            <span className="flex items-center gap-1">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {club.location.city}, {club.location.state}
            </span>
            <span className="flex items-center gap-1">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {club.memberCount} members
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

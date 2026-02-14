'use client';

import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

const categories = [
  { name: 'Sports & Fitness', icon: '&#9917;', count: '2,400+' },
  { name: 'Arts & Culture', icon: '&#127912;', count: '1,800+' },
  { name: 'Technology', icon: '&#128187;', count: '3,100+' },
  { name: 'Music', icon: '&#127925;', count: '1,500+' },
  { name: 'Outdoors & Adventure', icon: '&#9968;', count: '900+' },
  { name: 'Food & Drink', icon: '&#127860;', count: '1,200+' },
  { name: 'Business & Networking', icon: '&#128188;', count: '2,000+' },
  { name: 'Social', icon: '&#127881;', count: '3,500+' },
];

const valueStack = [
  {
    label: 'Club listing & discovery page',
    forClubs: true,
    value: '$299/mo',
  },
  { label: 'Member management dashboard', forClubs: true, value: '$99/mo' },
  { label: 'Event tools & RSVP tracking', forClubs: true, value: '$49/mo' },
  {
    label: '90-day promoted discovery placement',
    forClubs: true,
    value: '$500',
  },
  { label: 'Analytics & engagement insights', forClubs: true, value: '$79/mo' },
  { label: 'Browse & join unlimited clubs', forClubs: false, value: 'Priceless' },
  { label: 'One-click join — no applications', forClubs: false, value: 'Priceless' },
  {
    label: 'Unified event calendar across clubs',
    forClubs: false,
    value: 'Priceless',
  },
];

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 text-sm font-medium">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Now open for clubs everywhere
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Every club in your area.
              <br />
              <span className="text-accent-300">One place. One click.</span>
            </h1>
            <p className="text-lg md:text-xl text-brand-100 mb-8 max-w-2xl">
              Remember clubs day at uni? That buzz of discovering new groups and
              signing up on the spot? Clurbhouse brings that energy online — browse
              every club near you, join instantly, and never miss out again.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/discover"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-700 font-bold rounded-xl hover:bg-brand-50 transition-colors text-lg shadow-lg"
              >
                Discover Clubs
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              {!user && (
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-colors text-lg"
                >
                  List Your Club — Free
                </Link>
              )}
              {user && (
                <Link
                  href="/clubs/create"
                  className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-colors text-lg"
                >
                  Create a Club
                </Link>
              )}
            </div>
            <p className="text-brand-200 text-sm mt-4">
              Free forever. No credit card. No catch.
            </p>
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">16,000+</div>
              <div className="text-sm text-gray-500">Clubs listed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">50,000+</div>
              <div className="text-sm text-gray-500">Members joined</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">200+</div>
              <div className="text-sm text-gray-500">Cities</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">4.9/5</div>
              <div className="text-sm text-gray-500">Club satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Whatever you&apos;re into, there&apos;s a club for that
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From football to philosophy, coding to cooking — browse by category
              and find your people.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/discover?category=${encodeURIComponent(cat.name)}`}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-brand-300 hover:shadow-md transition-all text-center group"
              >
                <div
                  className="text-3xl mb-2"
                  dangerouslySetInnerHTML={{ __html: cat.icon }}
                />
                <div className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
                  {cat.name}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {cat.count} clubs
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* $100M Offer — Value Stack */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Here&apos;s everything you get. For free.
            </h2>
            <p className="text-lg text-gray-600">
              We built the platform clubs charge thousands for — then made it free.
              <br />
              You&apos;d feel silly saying no.
            </p>
          </div>

          <div className="space-y-3">
            {valueStack.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-gray-50 rounded-lg px-6 py-4 border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-green-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-800 font-medium">{item.label}</span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.forClubs ? 'bg-brand-100 text-brand-700' : 'bg-accent-100 text-accent-700'}`}
                  >
                    {item.forClubs ? 'For Clubs' : 'For Members'}
                  </span>
                </div>
                <span className="text-gray-400 line-through text-sm">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-gradient-to-r from-brand-600 to-brand-700 rounded-xl p-8 text-center text-white">
            <div className="text-sm font-medium text-brand-200 mb-2">
              Total value per year
            </div>
            <div className="text-4xl font-extrabold mb-1">
              <span className="line-through text-white/50 text-2xl mr-3">
                $6,824/yr
              </span>
              $0
            </div>
            <div className="text-brand-200 mb-6">
              Free today. Free tomorrow. Free forever.
            </div>
            <Link
              href={user ? '/clubs/create' : '/auth/signup'}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-700 font-bold rounded-xl hover:bg-brand-50 transition-colors text-lg"
            >
              {user ? 'Create Your Club Now' : 'Get Started — It\'s Free'}
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How it works
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Browse or search',
                desc: 'Filter by category, location, or vibe. Find clubs that match your interests in seconds.',
              },
              {
                step: '2',
                title: 'One-click join',
                desc: 'No applications. No waiting lists. See a club you like? Join instantly and start connecting.',
              },
              {
                step: '3',
                title: 'Show up and belong',
                desc: 'Get event notifications, meet your people, and be part of something bigger than yourself.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-brand-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stop scrolling. Start belonging.
          </h2>
          <p className="text-brand-200 text-lg mb-8">
            Join thousands of people who found their community on Clurbhouse.
            <br />
            Or list your club and watch it grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/discover"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-700 font-bold rounded-xl hover:bg-brand-50 transition-colors text-lg"
            >
              Find a Club
            </Link>
            <Link
              href={user ? '/clubs/create' : '/auth/signup'}
              className="inline-flex items-center justify-center px-8 py-4 bg-accent-500 text-white font-bold rounded-xl hover:bg-accent-600 transition-colors text-lg"
            >
              List Your Club Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-white font-bold text-lg">Clurbhouse</span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/discover" className="hover:text-white transition-colors">
                Discover
              </Link>
              <Link href="/clubs/create" className="hover:text-white transition-colors">
                Create a Club
              </Link>
            </div>
            <div className="text-sm">
              &copy; {new Date().getFullYear()} Clurbhouse. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

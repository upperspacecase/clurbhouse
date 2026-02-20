'use client';

import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

const categories = [
  { name: 'Sports & Fitness', icon: '&#9917;' },
  { name: 'Arts & Culture', icon: '&#127912;' },
  { name: 'Technology', icon: '&#128187;' },
  { name: 'Music', icon: '&#127925;' },
  { name: 'Outdoors & Adventure', icon: '&#9968;' },
  { name: 'Food & Drink', icon: '&#127860;' },
  { name: 'Business & Networking', icon: '&#128188;' },
  { name: 'Social', icon: '&#127881;' },
];

const plans = [
  {
    name: 'Starter',
    price: '$0',
    period: '',
    desc: 'Get listed. See if it works.',
    features: [
      'Club listing on House of Clubs',
      'Up to 50 members',
      'Basic club profile',
      'One admin seat',
    ],
    cta: 'Start Free',
    highlight: false,
  },
  {
    name: 'Growth',
    price: '$29',
    period: '/mo',
    desc: 'For clubs that are serious about growing.',
    features: [
      'Everything in Starter',
      'Unlimited members',
      'Featured in search results',
      'Member analytics dashboard',
      '3 admin seats',
      'Priority support',
    ],
    cta: 'Go Growth',
    highlight: true,
  },
  {
    name: 'Pro',
    price: '$79',
    period: '/mo',
    desc: 'Run your club like a proper operation.',
    features: [
      'Everything in Growth',
      'Verified badge',
      'Top of search placement',
      'Unlimited admin seats',
      'Advanced analytics',
      'Custom branding',
      'Dedicated account manager',
    ],
    cta: 'Go Pro',
    highlight: false,
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
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              A farmer&apos;s market
              <br />
              <span className="text-accent-300">for clubs.</span>
            </h1>
            <p className="text-lg md:text-xl text-brand-100 mb-8 max-w-2xl">
              Every club in your city, in one place. Browse what&apos;s around,
              join on the spot, manage your memberships.
              The digital layer that supports the physical one.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/discover"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-700 font-bold rounded-xl hover:bg-brand-50 transition-colors text-lg shadow-lg"
              >
                Browse Clubs
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href={user ? '/clubs/create' : '/auth/signup'}
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-colors text-lg"
              >
                List Your Club
              </Link>
            </div>
            <p className="text-brand-200 text-sm mt-4">
              Free for members. Always.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pick a category. See what&apos;s around.
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Football, photography, board games, rock climbing, book clubs,
              coding meetups — if people do it together, it&apos;s probably here.
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
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Three steps. That&apos;s it.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Search or scroll',
                desc: 'Filter by what you like, where you are, or just browse and see what catches your eye.',
              },
              {
                step: '2',
                title: 'Hit join',
                desc: 'No forms. No approval queues. No "we\'ll get back to you in 3-5 business days." You tap join, you\'re in.',
              },
              {
                step: '3',
                title: 'Show up',
                desc: 'Check the meeting schedule, rock up, and see if the vibe is right. Simple as that.',
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

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pricing for clubs
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Members browse and join for free. Clubs pick a plan.
              <br />
              Think about what you&apos;d spend on flyers, Facebook ads, or a Meetup
              subscription to get the same reach. Then look at these numbers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl p-8 flex flex-col ${
                  plan.highlight
                    ? 'bg-brand-600 text-white ring-4 ring-brand-300 scale-105'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <div className="mb-6">
                  <h3
                    className={`text-lg font-bold mb-1 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`text-sm mb-4 ${plan.highlight ? 'text-brand-100' : 'text-gray-500'}`}
                  >
                    {plan.desc}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-4xl font-extrabold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}
                    >
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span
                        className={`text-sm ${plan.highlight ? 'text-brand-200' : 'text-gray-500'}`}
                      >
                        {plan.period}
                      </span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <svg
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlight ? 'text-brand-200' : 'text-green-500'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className={plan.highlight ? 'text-brand-50' : 'text-gray-700'}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={user ? '/clubs/create' : '/auth/signup'}
                  className={`w-full py-3 rounded-xl font-semibold text-center block transition-colors ${
                    plan.highlight
                      ? 'bg-white text-brand-700 hover:bg-brand-50'
                      : 'bg-brand-600 text-white hover:bg-brand-700'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            No lock-in contracts. Cancel whenever. Starter is free forever, no card required.
          </p>
        </div>
      </section>

      {/* The pitch */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            Do the maths.
          </h2>
          <div className="space-y-6 text-lg text-gray-700">
            <p>
              Most clubs spend <strong>$200-500 a month</strong> on
              Instagram ads, printed flyers, and begging friends to share posts — just
              to get a handful of new members.
            </p>
            <p>
              Most of that money reaches people who scroll past, bin the flyer,
              or say &quot;yeah maybe&quot; and never think about it again.
            </p>
            <p>
              On House of Clubs, every person browsing is <em>already looking</em> for
              a club to join. They came here for that. You&apos;re not convincing
              anyone of anything — you&apos;re just being in the right place.
            </p>
            <p className="font-semibold text-gray-900">
              $29/month is less than a round of drinks at your next club social.
              And it actually brings people through the door.
            </p>
          </div>
          <div className="mt-10 text-center">
            <Link
              href={user ? '/clubs/create' : '/auth/signup'}
              className="inline-flex items-center justify-center px-8 py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors text-lg"
            >
              List Your Club
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Clubs are better when people actually show up.
          </h2>
          <p className="text-brand-200 text-lg mb-8">
            We fill your roster. You run the club.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/discover"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-700 font-bold rounded-xl hover:bg-brand-50 transition-colors text-lg"
            >
              Join a Club
            </Link>
            <Link
              href={user ? '/clubs/create' : '/auth/signup'}
              className="inline-flex items-center justify-center px-8 py-4 bg-accent-500 text-white font-bold rounded-xl hover:bg-accent-600 transition-colors text-lg"
            >
              List Your Club
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
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="text-white font-bold text-lg">House of Clubs</span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/discover" className="hover:text-white transition-colors">
                Discover
              </Link>
              <Link href="/clubs/create" className="hover:text-white transition-colors">
                List a Club
              </Link>
              <Link href="/#pricing" className="hover:text-white transition-colors">
                Pricing
              </Link>
            </div>
            <div className="text-sm">
              &copy; {new Date().getFullYear()} House of Clubs. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import toast from 'react-hot-toast';

const CATEGORIES = [
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
  'Other',
];

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$0/mo',
    desc: 'Get listed, up to 50 members, 1 admin seat.',
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '$29/mo',
    desc: 'Unlimited members, featured search, analytics, 3 admin seats.',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$79/mo',
    desc: 'Verified badge, top placement, unlimited admins, custom branding.',
  },
];

export default function CreateClubPage() {
  const router = useRouter();
  const { user, getIdToken } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    shortPitch: '',
    description: '',
    category: '',
    tags: '',
    plan: 'starter',
    city: '',
    state: '',
    meetingSchedule: '',
    contactEmail: '',
    website: '',
    instagram: '',
    twitter: '',
    discord: '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You need to sign in first');
      router.push('/auth/login');
      return;
    }

    setSubmitting(true);
    try {
      const token = await getIdToken();
      const res = await fetch('/api/clubs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          shortPitch: form.shortPitch,
          description: form.description,
          category: form.category,
          plan: form.plan,
          tags: form.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
          location: {
            city: form.city,
            state: form.state,
            country: 'Australia',
          },
          meetingSchedule: form.meetingSchedule,
          contactEmail: form.contactEmail,
          website: form.website,
          socials: {
            instagram: form.instagram,
            twitter: form.twitter,
            discord: form.discord,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success('Club created');
      router.push(`/clubs/${data.club.slug}`);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : 'Something went wrong'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Sign in to list your club
        </h1>
        <p className="text-gray-600 mb-6">
          You need an account to get your club on Clurbhouse.
        </p>
        <a
          href="/auth/signup"
          className="inline-flex items-center px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors"
        >
          Get Started
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          List Your Club
        </h1>
        <p className="text-gray-600">
          Fill in the details below. Takes about 2 minutes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Plan selection */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Pick a plan</h2>
          <div className="space-y-3">
            {PLANS.map((plan) => (
              <label
                key={plan.id}
                className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                  form.plan === plan.id
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="plan"
                  value={plan.id}
                  checked={form.plan === plan.id}
                  onChange={handleChange}
                  className="mt-1 accent-brand-600"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      {plan.name}
                    </span>
                    <span className="text-sm text-gray-500">{plan.price}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">{plan.desc}</p>
                </div>
              </label>
            ))}
          </div>
          {form.plan !== 'starter' && (
            <p className="text-xs text-gray-500">
              Paid plans will be billed after setup. You can start on Starter
              and upgrade later.
            </p>
          )}
        </div>

        {/* Basic info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">The basics</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Club Name *
            </label>
            <input
              type="text"
              name="name"
              required
              maxLength={100}
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Melbourne Running Club"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              One-liner * <span className="text-gray-400">(max 200 chars)</span>
            </label>
            <input
              type="text"
              name="shortPitch"
              required
              maxLength={200}
              value={form.shortPitch}
              onChange={handleChange}
              placeholder="What your club is about in one sentence"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Description *
            </label>
            <textarea
              name="description"
              required
              maxLength={2000}
              rows={5}
              value={form.description}
              onChange={handleChange}
              placeholder="What do you do? Who should join? What can people expect?"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              name="category"
              required
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags <span className="text-gray-400">(comma-separated)</span>
            </label>
            <input
              type="text"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="e.g. running, fitness, 5k, marathon"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
            />
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Where are you based?</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                name="city"
                required
                value={form.city}
                onChange={handleChange}
                placeholder="e.g. Melbourne"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <input
                type="text"
                name="state"
                required
                value={form.state}
                onChange={handleChange}
                placeholder="e.g. VIC"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Extra details</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meeting Schedule
            </label>
            <input
              type="text"
              name="meetingSchedule"
              value={form.meetingSchedule}
              onChange={handleChange}
              placeholder="e.g. Every Saturday 8am at Albert Park"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              name="contactEmail"
              value={form.contactEmail}
              onChange={handleChange}
              placeholder="club@example.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              type="url"
              name="website"
              value={form.website}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
            />
          </div>
        </div>

        {/* Socials */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Socials</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram
              </label>
              <input
                type="text"
                name="instagram"
                value={form.instagram}
                onChange={handleChange}
                placeholder="@handle"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Twitter / X
              </label>
              <input
                type="text"
                name="twitter"
                value={form.twitter}
                onChange={handleChange}
                placeholder="@handle"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discord
              </label>
              <input
                type="text"
                name="discord"
                value={form.discord}
                onChange={handleChange}
                placeholder="Invite link"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors text-lg disabled:opacity-50"
        >
          {submitting ? 'Creating...' : 'Create Club'}
        </button>
      </form>
    </div>
  );
}

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IClub extends Document {
  name: string;
  slug: string;
  description: string;
  shortPitch: string;
  category: string;
  tags: string[];
  plan: 'starter' | 'growth' | 'pro';
  location: {
    city: string;
    state: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  };
  imageUrl: string;
  bannerUrl: string;
  createdBy: string; // Firebase UID
  admins: string[];
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
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ClubSchema = new Schema<IClub>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true, maxlength: 2000 },
    shortPitch: { type: String, required: true, maxlength: 200 },
    category: {
      type: String,
      required: true,
      enum: [
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
      ],
    },
    tags: [{ type: String, trim: true, lowercase: true }],
    plan: {
      type: String,
      enum: ['starter', 'growth', 'pro'],
      default: 'starter',
    },
    location: {
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true, default: 'Australia' },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    imageUrl: { type: String, default: '' },
    bannerUrl: { type: String, default: '' },
    createdBy: { type: String, required: true },
    admins: [{ type: String }],
    memberCount: { type: Number, default: 0 },
    maxMembers: { type: Number, default: null },
    meetingSchedule: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    website: { type: String, default: '' },
    socials: {
      instagram: String,
      twitter: String,
      discord: String,
      facebook: String,
    },
    isVerified: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// slug already indexed via unique: true on schema
ClubSchema.index({ category: 1 });
ClubSchema.index({ 'location.city': 1 });
ClubSchema.index({ tags: 1 });
ClubSchema.index({ name: 'text', description: 'text', tags: 'text' });

const Club: Model<IClub> =
  mongoose.models.Club || mongoose.model<IClub>('Club', ClubSchema);

export default Club;

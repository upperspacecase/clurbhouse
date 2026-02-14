import { NextRequest } from 'next/server';
import { verifyAuth, withDB, jsonResponse, errorResponse } from '@/lib/api';
import Club from '@/models/Club';
import Membership from '@/models/Membership';
import User from '@/models/User';

// GET /api/clubs — list & search clubs
export async function GET(req: NextRequest) {
  await withDB();

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  const category = searchParams.get('category');
  const city = searchParams.get('city');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = Math.min(parseInt(searchParams.get('limit') || '24', 10), 50);
  const skip = (page - 1) * limit;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: Record<string, any> = { isActive: true };

  if (category) filter.category = category;
  if (city) filter['location.city'] = { $regex: city, $options: 'i' };
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { tags: { $in: [new RegExp(q, 'i')] } },
    ];
  }

  const [clubs, total] = await Promise.all([
    Club.find(filter)
      .sort({ isFeatured: -1, memberCount: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Club.countDocuments(filter),
  ]);

  return jsonResponse({
    clubs,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

// POST /api/clubs — create a new club
export async function POST(req: NextRequest) {
  const authUser = await verifyAuth(req);
  if (!authUser) return errorResponse('Unauthorized', 401);

  await withDB();

  const body = await req.json();
  const {
    name,
    shortPitch,
    description,
    category,
    tags,
    location,
    meetingSchedule,
    contactEmail,
    website,
    socials,
  } = body;

  if (!name || !shortPitch || !description || !category || !location?.city || !location?.state) {
    return errorResponse('Missing required fields');
  }

  // Generate slug
  let slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  // Ensure unique slug
  const existing = await Club.findOne({ slug });
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const club = await Club.create({
    name,
    slug,
    shortPitch,
    description,
    category,
    tags: tags || [],
    location,
    createdBy: authUser.uid,
    admins: [authUser.uid],
    meetingSchedule: meetingSchedule || '',
    contactEmail: contactEmail || '',
    website: website || '',
    socials: socials || {},
    memberCount: 1, // Creator counts as member
  });

  // Create membership for creator
  await Membership.create({
    userId: authUser.uid,
    clubId: club._id,
    role: 'owner',
  });

  // Update user stats
  await User.findOneAndUpdate(
    { firebaseUid: authUser.uid },
    { $inc: { clubsCreated: 1, clubsJoined: 1 } }
  );

  return jsonResponse({ club }, 201);
}

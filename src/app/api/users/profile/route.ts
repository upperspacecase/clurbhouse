import { NextRequest } from 'next/server';
import { verifyAuth, withDB, jsonResponse, errorResponse } from '@/lib/api';
import User from '@/models/User';
import Membership from '@/models/Membership';
import Club from '@/models/Club';

// POST /api/users/profile — create/update user profile (called on auth state change)
export async function POST(req: NextRequest) {
  const authUser = await verifyAuth(req);
  if (!authUser) return errorResponse('Unauthorized', 401);

  await withDB();

  const body = await req.json();

  const user = await User.findOneAndUpdate(
    { firebaseUid: authUser.uid },
    {
      $set: {
        email: authUser.email || body.email,
        displayName: body.displayName || 'User',
        photoUrl: body.photoUrl || '',
      },
      $setOnInsert: {
        firebaseUid: authUser.uid,
        interests: [],
        location: { city: '', state: '', country: 'Australia' },
        clubsJoined: 0,
        clubsCreated: 0,
        isActive: true,
      },
    },
    { upsert: true, new: true }
  ).lean();

  return jsonResponse({ user });
}

// GET /api/users/profile — get user profile with clubs
export async function GET(req: NextRequest) {
  const authUser = await verifyAuth(req);
  if (!authUser) return errorResponse('Unauthorized', 401);

  await withDB();

  const user = await User.findOne({ firebaseUid: authUser.uid }).lean();
  if (!user) return errorResponse('User not found', 404);

  // Get joined clubs
  const memberships = await Membership.find({
    userId: authUser.uid,
    isActive: true,
  }).lean();

  const clubIds = memberships.map((m) => m.clubId);

  const [joinedClubs, createdClubs] = await Promise.all([
    Club.find({ _id: { $in: clubIds }, isActive: true })
      .sort({ memberCount: -1 })
      .lean(),
    Club.find({ createdBy: authUser.uid, isActive: true })
      .sort({ createdAt: -1 })
      .lean(),
  ]);

  return jsonResponse({ user, joinedClubs, createdClubs });
}

// PUT /api/users/profile — update profile details
export async function PUT(req: NextRequest) {
  const authUser = await verifyAuth(req);
  if (!authUser) return errorResponse('Unauthorized', 401);

  await withDB();

  const body = await req.json();
  const allowed = ['displayName', 'bio', 'interests', 'location', 'photoUrl'];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (body[key] !== undefined) updates[key] = body[key];
  }

  const user = await User.findOneAndUpdate(
    { firebaseUid: authUser.uid },
    { $set: updates },
    { new: true }
  ).lean();

  return jsonResponse({ user });
}

import { NextRequest } from 'next/server';
import { verifyAuth, withDB, jsonResponse, errorResponse } from '@/lib/api';
import Club from '@/models/Club';
import Membership from '@/models/Membership';
import User from '@/models/User';

// POST /api/clubs/:slug/join — join a club
export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const authUser = await verifyAuth(req);
  if (!authUser) return errorResponse('Unauthorized', 401);

  await withDB();

  const club = await Club.findOne({ slug: params.slug, isActive: true });
  if (!club) return errorResponse('Club not found', 404);

  // Check if already a member
  const existing = await Membership.findOne({
    userId: authUser.uid,
    clubId: club._id,
  });

  if (existing && existing.isActive) {
    return errorResponse('Already a member of this club');
  }

  // Check max members
  if (club.maxMembers && club.memberCount >= club.maxMembers) {
    return errorResponse('Club is full');
  }

  if (existing && !existing.isActive) {
    // Re-activate membership
    existing.isActive = true;
    existing.joinedAt = new Date();
    existing.role = 'member';
    await existing.save();
  } else {
    await Membership.create({
      userId: authUser.uid,
      clubId: club._id,
      role: 'member',
    });
  }

  await Club.findByIdAndUpdate(club._id, { $inc: { memberCount: 1 } });
  await User.findOneAndUpdate(
    { firebaseUid: authUser.uid },
    { $inc: { clubsJoined: 1 } }
  );

  return jsonResponse({ message: 'Joined successfully' });
}

// DELETE /api/clubs/:slug/join — leave a club
export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const authUser = await verifyAuth(req);
  if (!authUser) return errorResponse('Unauthorized', 401);

  await withDB();

  const club = await Club.findOne({ slug: params.slug });
  if (!club) return errorResponse('Club not found', 404);

  // Owners can't leave their own club
  if (club.createdBy === authUser.uid) {
    return errorResponse('Owners cannot leave their own club. Transfer ownership or delete the club instead.');
  }

  const membership = await Membership.findOne({
    userId: authUser.uid,
    clubId: club._id,
    isActive: true,
  });

  if (!membership) {
    return errorResponse('Not a member of this club');
  }

  membership.isActive = false;
  await membership.save();

  await Club.findByIdAndUpdate(club._id, {
    $inc: { memberCount: -1 },
  });
  await User.findOneAndUpdate(
    { firebaseUid: authUser.uid },
    { $inc: { clubsJoined: -1 } }
  );

  return jsonResponse({ message: 'Left club successfully' });
}

import { NextRequest } from 'next/server';
import { verifyAuth, withDB, jsonResponse, errorResponse } from '@/lib/api';
import Club from '@/models/Club';
import Membership from '@/models/Membership';

// GET /api/clubs/:slug — get club details
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  await withDB();

  const club = await Club.findOne({
    slug: params.slug,
    isActive: true,
  }).lean();

  if (!club) return errorResponse('Club not found', 404);

  // Check if current user is a member
  let isMember = false;
  const authUser = await verifyAuth(req);
  if (authUser) {
    const membership = await Membership.findOne({
      userId: authUser.uid,
      clubId: club._id,
      isActive: true,
    });
    isMember = !!membership;
  }

  return jsonResponse({ club, isMember });
}

// PUT /api/clubs/:slug — update club (admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const authUser = await verifyAuth(req);
  if (!authUser) return errorResponse('Unauthorized', 401);

  await withDB();

  const club = await Club.findOne({ slug: params.slug });
  if (!club) return errorResponse('Club not found', 404);

  if (club.createdBy !== authUser.uid && !club.admins.includes(authUser.uid)) {
    return errorResponse('Only admins can update this club', 403);
  }

  const body = await req.json();
  const allowed = [
    'name',
    'shortPitch',
    'description',
    'category',
    'tags',
    'location',
    'meetingSchedule',
    'contactEmail',
    'website',
    'socials',
    'imageUrl',
    'bannerUrl',
    'maxMembers',
  ];

  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (body[key] !== undefined) updates[key] = body[key];
  }

  const updated = await Club.findByIdAndUpdate(club._id, updates, {
    new: true,
  }).lean();

  return jsonResponse({ club: updated });
}

// DELETE /api/clubs/:slug — deactivate club (owner only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const authUser = await verifyAuth(req);
  if (!authUser) return errorResponse('Unauthorized', 401);

  await withDB();

  const club = await Club.findOne({ slug: params.slug });
  if (!club) return errorResponse('Club not found', 404);

  if (club.createdBy !== authUser.uid) {
    return errorResponse('Only the owner can delete this club', 403);
  }

  await Club.findByIdAndUpdate(club._id, { isActive: false });
  await Membership.updateMany({ clubId: club._id }, { isActive: false });

  return jsonResponse({ message: 'Club deactivated' });
}

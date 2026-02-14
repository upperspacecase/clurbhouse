import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMembership extends Document {
  userId: string; // Firebase UID
  clubId: mongoose.Types.ObjectId;
  role: 'member' | 'admin' | 'owner';
  joinedAt: Date;
  isActive: boolean;
}

const MembershipSchema = new Schema<IMembership>(
  {
    userId: { type: String, required: true },
    clubId: { type: Schema.Types.ObjectId, ref: 'Club', required: true },
    role: {
      type: String,
      enum: ['member', 'admin', 'owner'],
      default: 'member',
    },
    joinedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

MembershipSchema.index({ userId: 1, clubId: 1 }, { unique: true });
MembershipSchema.index({ clubId: 1 });
MembershipSchema.index({ userId: 1 });

const Membership: Model<IMembership> =
  mongoose.models.Membership ||
  mongoose.model<IMembership>('Membership', MembershipSchema);

export default Membership;

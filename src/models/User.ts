import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  firebaseUid: string;
  email: string;
  displayName: string;
  photoUrl: string;
  bio: string;
  interests: string[];
  location: {
    city: string;
    state: string;
    country: string;
  };
  clubsJoined: number;
  clubsCreated: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firebaseUid: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    displayName: { type: String, required: true, trim: true },
    photoUrl: { type: String, default: '' },
    bio: { type: String, maxlength: 500, default: '' },
    interests: [{ type: String, trim: true, lowercase: true }],
    location: {
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      country: { type: String, default: 'Australia' },
    },
    clubsJoined: { type: Number, default: 0 },
    clubsCreated: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// firebaseUid already indexed via unique: true on schema

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;

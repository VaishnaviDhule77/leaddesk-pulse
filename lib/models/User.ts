import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string; password_hash: string; createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  { username: { type: String, required: true, unique: true, trim: true }, password_hash: { type: String, required: true } },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
import mongoose, { Schema, Document } from 'mongoose';

export interface IOTP extends Document {
  email: string;
  otp: string;
  createdAt: Date;
}

const otpSchema: Schema = new Schema(
  {
    email: { type: String, required: true, index: true },
    otp: { type: String, required: true },
  },
  { timestamps: true }
);

// TTL based on createdAt (10 minutes)
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

// Protect against model overwrite during watch/hot reload
export const OTP = (mongoose.models.OTP as mongoose.Model<IOTP>) || mongoose.model<IOTP>('OTP', otpSchema);
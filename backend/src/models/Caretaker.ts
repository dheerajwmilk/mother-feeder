import mongoose, { Schema, Document } from 'mongoose';

export interface ICaretaker extends Document {
  userId: mongoose.Types.ObjectId;
  email: string;
  fname: string;
  lname: string;
  phone?: string;
  status: 'pending' | 'approved' | 'rejected';
  profileCompleted: boolean;
  // Onboarding fields (optional)
  selectedCity?: string;
  availabilityDays?: string[];
  startTime?: string;
  endTime?: string;
  hourlyRate?: number;
  services?: string[];
  experienceLevel?: string;
  about?: string;
  languages?: string;
  education?: string;
  documents?: { type: string; url: string }[];
}

const caretakerSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    phone: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    profileCompleted: { type: Boolean, default: false },
    selectedCity: { type: String },
    availabilityDays: { type: [String], default: [] },
    startTime: { type: String },
    endTime: { type: String },
    hourlyRate: { type: Number },
    services: { type: [String], default: [] },
    experienceLevel: { type: String },
    about: { type: String },
    languages: { type: String },
    education: { type: String },
    documents: {
      type: [
        {
          type: new Schema({ type: { type: String, required: true }, url: { type: String, required: true } }, { _id: false })
        } as any
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export const Caretaker = (mongoose.models.Caretaker as mongoose.Model<ICaretaker>) || mongoose.model<ICaretaker>('Caretaker', caretakerSchema);



import mongoose from 'mongoose';

export interface ICaregiver extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  specialization: string[];
  experience: number;
  bio: string;
  hourlyRate: number;
  availability: {
    day: string;
    slots: string[];
  }[];
  ratings: {
    userId: mongoose.Types.ObjectId;
    rating: number;
    review: string;
    date: Date;
  }[];
}

const caregiverSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  specialization: [{
    type: String,
    required: true,
  }],
  experience: {
    type: Number,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  hourlyRate: {
    type: Number,
    required: true,
  },
  availability: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true,
    },
    slots: [{
      type: String,
      required: true,
    }],
  }],
  ratings: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: String,
    date: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
});

export const Caregiver = mongoose.model<ICaregiver>('Caregiver', caregiverSchema);
import mongoose from 'mongoose';

export interface IBooking extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  city: string;
  services: string[];
  selectedCaregiver: string;
  startDate: Date;
  endDate?: Date;
  startTime: string;
  duration: string;
  frequency: string;
  serviceAddress: string;
  specialInstructions?: string;
  babyAge?: string;
  urgency?: string;
  specialNeeds?: string;
  amount: number;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod?: string;
  transactionId?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  city: {
    type: String,
    required: true,
  },
  services: [{
    type: String,
    required: true,
  }],
  selectedCaregiver: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  startTime: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  frequency: {
    type: String,
    required: true,
  },
  serviceAddress: {
    type: String,
    required: true,
  },
  specialInstructions: {
    type: String,
  },
  babyAge: {
    type: String,
  },
  urgency: {
    type: String,
  },
  specialNeeds: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
  },
  transactionId: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  notes: {
    type: String,
  },
}, {
  timestamps: true,
});

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
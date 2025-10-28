import { Request, Response } from 'express';
import { Booking } from '../models/Booking';

export const createBooking = async (req: Request, res: Response) => {
  try {
    const user: any = (req as any).user;
    const {
      city,
      services,
      selectedCaregiver,
      startDate,
      endDate,
      startTime,
      duration,
      frequency,
      serviceAddress,
      specialInstructions,
      babyAge,
      urgency,
      specialNeeds,
      amount,
      paymentStatus,
      paymentMethod,
      transactionId,
    } = req.body;

    const booking = new Booking({
      userId: user._id,
      city,
      services,
      selectedCaregiver,
      startDate,
      endDate,
      startTime,
      duration,
      frequency,
      serviceAddress,
      specialInstructions,
      babyAge,
      urgency,
      specialNeeds,
      amount,
      paymentStatus: paymentStatus || 'pending',
      paymentMethod,
      transactionId,
      status: 'pending',
    });

    const savedBooking = await booking.save();
    return res.status(201).json({ message: 'Booking created successfully', booking: savedBooking });
  } catch (error: any) {
    console.error('Create booking error:', error);
    return res.status(500).json({ message: 'Failed to create booking', error: error.message });
  }
};

export const updateBookingPayment = async (req: Request, res: Response) => {
  try {
    const user: any = (req as any).user;
    const { bookingId } = req.params;
    const { paymentStatus, transactionId, paymentMethod } = req.body;

    const booking = await Booking.findOne({ _id: bookingId, userId: user._id });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.paymentStatus = paymentStatus;
    booking.transactionId = transactionId;
    booking.paymentMethod = paymentMethod;

    if (paymentStatus === 'completed') {
      booking.status = 'confirmed';
    }

    const updatedBooking = await booking.save();
    return res.json({ message: 'Payment status updated', booking: updatedBooking });
  } catch (error: any) {
    console.error('Update booking payment error:', error);
    return res.status(500).json({ message: 'Failed to update payment status', error: error.message });
  }
};

export const getMyBookings = async (req: Request, res: Response) => {
  try {
    const user: any = (req as any).user;
    const bookings = await Booking.find({ userId: user._id }).sort({ createdAt: -1 });
    return res.json({ bookings });
  } catch (error: any) {
    console.error('Get my bookings error:', error);
    return res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
};


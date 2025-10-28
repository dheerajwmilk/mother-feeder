import express from 'express';
import { auth } from '../middleware/auth';
import { createBooking, updateBookingPayment, getMyBookings } from '../controllers/bookingController';
import { createRazorpayOrder, verifyRazorpayPayment } from '../controllers/razorpayController';

const router = express.Router();

// Create a new booking
router.post('/', auth, createBooking);

// Update payment status
router.patch('/:bookingId/payment', auth, updateBookingPayment);

// Get user's bookings
router.get('/me', auth, getMyBookings);

// Razorpay order creation
router.post('/create-razorpay-order', auth, createRazorpayOrder);

// Verify Razorpay payment
router.post('/verify-razorpay-payment', auth, verifyRazorpayPayment);

export default router;


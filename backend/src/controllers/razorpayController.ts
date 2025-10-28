import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export const createRazorpayOrder = async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'INR' } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const options = {
      amount: amount * 100, // Convert to paise (multiply by 100)
      currency,
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};

export const verifyRazorpayPayment = async (req: Request, res: Response) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    const text = orderId + '|' + paymentId;
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(text)
      .digest('hex');

    if (generatedSignature === signature) {
      res.json({ verified: true });
    } else {
      res.status(400).json({ verified: false, message: 'Invalid signature' });
    }
  } catch (error: any) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Payment verification failed', error: error.message });
  }
};


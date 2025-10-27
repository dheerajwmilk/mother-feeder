import express from 'express';
import { register, login, sendOTP, sendResetOTP, resetPassword } from '../controllers/authController';
import { body } from 'express-validator';

const router = express.Router();

// Register route with validation
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('fname').notEmpty().withMessage(' First Name is required'),
    body('lname').notEmpty().withMessage(' last Name is required'),
    body('otp').notEmpty().withMessage('OTP is required'),
  ],
  register
);

// Send OTP route
router.post(
  '/send-otp',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
  ],
  sendOTP
);

// Login route with validation
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

// Forgot password - send reset OTP
router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('Please enter a valid email')],
  sendResetOTP
);

// Reset password using OTP
router.post(
  '/reset-password',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('otp').notEmpty().withMessage('OTP is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  resetPassword
);

export default router;


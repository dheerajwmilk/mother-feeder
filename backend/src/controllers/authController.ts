import { Request, Response } from 'express';
import { User } from '../models/User';
import { OTP } from '../models/OTP';
import jwt from 'jsonwebtoken';
const sgMail = require('@sendgrid/mail')



const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string' || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP to database
    await OTP.create({ email, otp });

    // Send OTP via email

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    // sgMail.setDataResidency('eu'); 
    // uncomment the above line if you are sending mail using a regional EU subuser

    const msg = {
      to: email, // Change to your recipient
      from: 'dheerajthalor2021@gmail.com', // Change to your verified sender
      subject: 'Welcome to NEONEST',
      text: `Your NeoNest welcome code is ${otp}`,
      html: `<p>Your NeoNest welcome code is <strong>${otp}</strong></p>`,
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error:string) => {
        console.error(error)
      })

  // For local/dev convenience return the OTP in the response when not in production
  const responsePayload: any = { message: 'OTP sent successfully' };
  // For local testing include OTP in response to simplify end-to-end testing.
  responsePayload.otp = otp;
  return res.status(200).json(responsePayload);
  } catch (error) {
    console.error('sendOTP error', error);
    res.status(500).json({ message: 'Error sending OTP', error: (error as any).message || String(error) });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, fname,lname, phone, role, otp } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ isExistingUser: true, message: 'User already exists' });
    }
    if(!email || !password || !fname || !lname || !otp){
        return res.status(400).json({
          message:"any thing is missing"
        })
    }
    // Verify OTP
    const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 });
    // Compare as strings to avoid type mismatch between stored otp and request body
    const providedOtp = otp ? String(otp).trim() : '';
    if (!otpRecord || otpRecord.otp !== providedOtp) {
      console.warn(`OTP verification failed for ${email}. Provided: ${providedOtp}, Expected: ${otpRecord?.otp}`);
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Create new user
    const user = new User({
      email,
      password,
      fname,
      lname,
      phone: phone || undefined,
      role: role || 'user',
      isEmailVerified: true,
    });

    await user.save();
    await OTP.deleteMany({ email }); // Clean up used OTPs

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        fname: user.fname,
        lname:user.lname,
        role: user.role,
        isEmailVerified: true,
      },
    });
  } catch (error) {
    console.error('register error', error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }



    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        fname:user.fname,
        lname:user.lname,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
};

// Send OTP for password reset (forgot password)
export const sendResetOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string' || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    // Ensure user exists
    const user = await User.findOne({ email });
    if (!user) {
      // For security, don't reveal whether user exists. Still respond success.
      return res.status(200).json({ message: 'OTP sent if account exists' });
    }

    const otp = generateOTP();
    await OTP.create({ email, otp });

    // send email
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email,
      from: 'dheerajthalor2021@gmail.com',
      subject: 'Password reset code',
      text: `Your NeoNest password reset code is ${otp}`,
      html: `<p>Your NeoNest password reset code is <strong>${otp}</strong></p>`,
    };
    sgMail
      .send(msg)
      .then(() => console.log('Password reset email sent'))
      .catch((err: any) => console.error(err));

    const responsePayload: any = { message: 'OTP sent if account exists' };
    if (process.env.NODE_ENV !== 'production') responsePayload.otp = otp;
    return res.status(200).json(responsePayload);
  } catch (error) {
    console.error('sendResetOTP error', error);
    res.status(500).json({ message: 'Error sending OTP', error: (error as any).message || String(error) });
  }
};

// Reset password using OTP
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 });
    const providedOtp = String(otp).trim();
    if (!otpRecord || otpRecord.otp !== providedOtp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = newPassword;
    await user.save();
    await OTP.deleteMany({ email });

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('resetPassword error', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
};
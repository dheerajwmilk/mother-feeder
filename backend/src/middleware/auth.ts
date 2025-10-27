import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

interface TokenPayload {
  id: string;
  role: string;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as TokenPayload;
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new Error();
    }

    // attach user to request (cast to any to avoid type conflicts with other libs)
    (req as any).user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate.' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const r: any = req as any;
    if (!r.user) {
      return res.status(401).json({ message: 'Please authenticate.' });
    }

    if (!roles.includes(r.user.role)) {
      return res.status(403).json({ message: 'Not authorized to access this resource.' });
    }

    next();
  };
};
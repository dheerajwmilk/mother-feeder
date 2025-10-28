import { Request, Response } from 'express';
import { Caretaker } from '../models/Caretaker';

export const getMyCaretakerProfile = async (req: Request, res: Response) => {
  try {
    const user: any = (req as any).user;
    const profile = await Caretaker.findOne({ userId: user._id });
    if (!profile) return res.status(404).json({ message: 'Caretaker profile not found' });
    return res.json({ profile });
  } catch (e: any) {
    return res.status(500).json({ message: 'Failed to fetch caretaker profile', error: e.message });
  }
};

export const upsertCaretakerProfile = async (req: Request, res: Response) => {
  try {
    const user: any = (req as any).user;
    const {
      selectedCity,
      availabilityDays,
      startTime,
      endTime,
      hourlyRate,
      services,
      experienceLevel,
      about,
      languages,
      education,
      profileCompleted,
    } = req.body || {};

    const update = {
      selectedCity,
      availabilityDays,
      startTime,
      endTime,
      hourlyRate,
      services,
      experienceLevel,
      about,
      languages,
      education,
      profileCompleted: Boolean(profileCompleted),
    } as any;

    // remove undefined fields
    Object.keys(update).forEach((k) => update[k] === undefined && delete update[k]);

    // If the profile is marked completed, ensure status is at least 'pending' (don't override approved/rejected)
    const existing = await Caretaker.findOne({ userId: user._id });
    if (update.profileCompleted) {
      if (!existing || !existing.status || existing.status === 'pending') {
        update.status = 'pending';
      }
    }

    const profile = await Caretaker.findOneAndUpdate(
      { userId: user._id },
      { $set: update },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.json({ message: 'Profile saved', profile });
  } catch (e: any) {
    return res.status(500).json({ message: 'Failed to save caretaker profile', error: e.message });
  }
};

export const uploadCaretakerDocument = async (req: Request, res: Response) => {
  try {
    const user: any = (req as any).user;
    const fileUrl = (req as any).fileUrl as string;
    const docType = (req as any).body?.type || 'document';
    if (!fileUrl) return res.status(400).json({ message: 'Upload failed' });

    const profile = await Caretaker.findOneAndUpdate(
      { userId: user._id },
      { $push: { documents: { type: docType, url: fileUrl } } },
      { new: true, upsert: true }
    );

    return res.json({ message: 'Document uploaded', url: fileUrl, profile });
  } catch (e: any) {
    return res.status(500).json({ message: 'Failed to upload document', error: e.message });
  }
};



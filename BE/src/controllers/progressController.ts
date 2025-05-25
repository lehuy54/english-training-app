import { Request, Response } from 'express';
import { getUserProgressStats } from '../services/progressService';

export const fetchUserProgressStats = async (req: any, res: Response) => {
  const userId = parseInt(req.params.userId, 10);
  const content_type = req.params.contentType;

  try {
    const stats = await getUserProgressStats(userId, content_type);
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
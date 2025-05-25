// src/middleware/authJwt.ts
import jwt from 'jsonwebtoken';
import config from '../config';
import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  console.log('\n====== AUTH MIDDLEWARE ======');
  console.log('Headers:', req.headers);
  const authHeader = req.headers['authorization'];
  console.log('Authorization header:', authHeader);
  const token = authHeader && authHeader.split(' ')[1];
  console.log('Token:', token ? token.substring(0, 20) + '...' : 'Không có token');

  if (!token) {
    console.log('Auth failed: Không có token');
    console.log('==============================\n');
    res.status(401).json({ error: 'Không có token' });
    return;
  }

  console.log('Verifying token with secret:', config.jwtSecret.substring(0, 5) + '...');
  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) {
      console.log('Token verification failed:', err.message);
      console.log('==============================\n');
      res.status(403).json({ error: 'Token không hợp lệ' });
      return;
    }

    console.log('Token verified successfully. User:', user);
    console.log('==============================\n');
    req.user = user;
    next(); // phải đảm bảo next() là cuối và không return response sau đó
  });
};

export const ensureAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ error: 'Chỉ admin mới có thể thực hiện hành động này' });
    return;
  }

  next();
};

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: {
        id: string;
        username: string;
        email: string;
      };
    }
  }
}

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    req.user = user as any;
    req.userId = (user as any).userId;
    next();
  });
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', err);

  if (err.code === '23505') {
    // Unique violation
    return res.status(409).json({ error: 'Record already exists' });
  }

  if (err.code === '23503') {
    // Foreign key violation
    return res.status(400).json({ error: 'Invalid reference' });
  }

  res.status(500).json({ error: 'Internal server error' });
}

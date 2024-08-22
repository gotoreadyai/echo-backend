import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user'; // Import modelu użytkownika

interface TokenPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface RequestWithUser extends Request {
  user: { id: string; email: string; role: string }; // Dodajemy pole `role`
}

export const verifyToken: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'A token is required for authentication' });
  }

  try {
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as TokenPayload;

    // Znajdź użytkownika na podstawie ID z tokenu
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Dodajemy `user` do `req` z rolą użytkownika
    (req as RequestWithUser).user = { id: user.id, email: user.email, role: user.role };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

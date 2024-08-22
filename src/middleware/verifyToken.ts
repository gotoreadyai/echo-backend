import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: number;
  email: string;
  iat?: number;
  exp?: number;
}

interface RequestWithUser extends Request {
  user: { id: number; email: string };
}

export const verifyToken: RequestHandler = (
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

    // Dodajemy `user` do `req` za pomocą Type Assertion
    (req as RequestWithUser).user = { id: decoded.id, email: decoded.email };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

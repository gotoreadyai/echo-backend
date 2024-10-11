// src/middleware/authenticateToken.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { RequestWithId } from "../plugins/_JWTauth/Types";

const jwtSecret = process.env.JWT_SECRET!;

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, jwtSecret, (err: any, user: any) => {
    if (err) {
      return res.sendStatus(403);
    }

    (req as RequestWithId).userId = user.id;
    next();
  });
};

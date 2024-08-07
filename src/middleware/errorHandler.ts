import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong! - check server logs" });
};

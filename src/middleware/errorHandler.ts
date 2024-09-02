import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error.message) {
    res.status(500).json({
      error: error.message,
      details: error instanceof Error ? error.message : "Unknown error",
      fullError: error,
    });
  } else {
    res
      .status(500)
      .json({ error: "Something went wrong! - check server logs" });
  }
};

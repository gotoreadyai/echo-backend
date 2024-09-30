import { Request, Response, NextFunction } from "express";
import { saveJsonToFile } from "../services/seedService";

export const saveData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, data } = req.body;
    const filePath = await saveJsonToFile('./incommingSeeds', name, data);
    res.status(201).json({ message: "Dane zapisane pomyślnie", filePath });
  } catch (error) {
    next(error);
  }
};

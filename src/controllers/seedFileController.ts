import { Request, Response, NextFunction } from "express";
import { saveJsonToFile } from "../services/seedService";
import Document from "./../models/document";

/**
 * Middleware do zapisu dokumentów do plików.
 * @param {Request} req - Obiekt żądania Express.
 * @param {Response} res - Obiekt odpowiedzi Express.
 * @param {NextFunction} next - Funkcja do przekazania sterowania do następnego middleware.
 * @returns {Promise<void>} - Zwraca obietnicę zakończenia operacji.
 */
export const saveFiles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { plugin } = req.body;

    const documents = await Document.findAll({
      where: { plugin: plugin },
    });

    if (!documents.length) {
      return res
        .status(404)
        .json({ 
          error: `No documents found for the provided plugin: ${plugin}. Please ensure the plugin name is correct.` 
        });
    }

    for (const document of documents) {
      const fileName = `${document.slug}`;
      console.log(document,fileName);
      
      await saveJsonToFile(
        `./incommingSeeds/${plugin}`,
        fileName,
        document.content
      );
    }

    return res
      .status(200)
      .json({ 
        message: `Successfully retrieved and saved ${documents.length} documents for the plugin: ${plugin}.` 
      });
  } catch (error) {
    next(error);
  }
};

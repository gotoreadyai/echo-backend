import { Request, Response, NextFunction } from "express";
import { saveJsonToFile } from "../services/seedService";
import Document from "./../models/document";

export const saveData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, data, plugin, slug, type } = req.body;

    if (type === "File") {
      // Pobierz dokumenty, które mają kolumnę plugin równą wartości plugin
      const documents = await Document.findAll({
        where: { plugin: plugin },
      });

      if (!documents.length) {
        return res
          .status(404)
          .json({ error: "No documents found for the provided plugin" });
      }

      // Iteracja przez wszystkie dokumenty i zapis ich content do plików
      for (const document of documents) {
        const fileName = `${document.slug}.json`; // Nazwa pliku na podstawie slug lub name
        const filePath = await saveJsonToFile(
          `./incommingSeeds/${plugin}`,
          fileName,
          document.content
        );

        console.log(`Zapisano dokument: ${fileName} w ścieżce: ${filePath}`);
      }

      return res
        .status(200)
        .json({ message: "Documents retrieved and saved successfully" });
    }

    if (type === "Content") {
      // Tutaj obsługa typu 'Content'
    }
  } catch (error) {
    next(error);
  }
};

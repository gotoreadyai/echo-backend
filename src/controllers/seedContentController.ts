import { Request, Response, NextFunction } from "express";
import { saveJsonToFile } from "../services/seedService";
import path from "path";
import fs from "fs/promises";
import { ModelStatic, Model } from "sequelize";

/**
 * Middleware do zapisu treści (Content) z uzupełnieniem na podstawie modelu slug.
 * @param {ModelStatic<Model>} slugModel - Model Sequelize używany do pobierania danych dla sluga.
 * @returns Middleware funkcja Express
 */
export const saveContent = (slugModel: ModelStatic<Model>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { plugin, name } = req.body;

      // Ścieżka do pliku _init.json na podstawie plugin i slug
      const contentFilePath = path.join(
        "src",
        "plugins",
        plugin,
        "seedSlug",
        "_init.json"
      );

      try {
        // Pobierz dane z modelu slug i uzupełnij zawartość JSON
        const slugData = await slugModel.findAll({});

        if (!slugData.length) {
          return res
            .status(404)
            .json({ 
              error: `No slug data found for the plugin: ${plugin}. Please ensure the plugin and slug are correct.` 
            });
        }

        const updatedContent = slugData.map((item: any) => ({
          model: name,
          data: {
            ...item.dataValues,
          },
        }));

        // Zapisz zaktualizowane dane do pliku
        const filePath = await saveJsonToFile(
          `./incommingSeeds/${plugin}`,
          `_init.json.${name}`,
          updatedContent
        );

        return res
          .status(200)
          .json({ 
            message: `Content for ${name} successfully retrieved and saved in ${filePath}` 
          });
      } catch (error) {
        console.error(
          `Error retrieving content from ${contentFilePath}:`,
          error
        );
        return res
          .status(500)
          .json({ 
            error: `Error retrieving content from the specified file at: ${contentFilePath}. Please check the file path and try again.` 
          });
      }
    } catch (error) {
      next(error); // Przekazanie błędu do middleware błędów
    }
  };
};

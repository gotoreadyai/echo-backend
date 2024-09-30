// src/controllers/slugController.ts
import { Request, Response, NextFunction } from "express";
import { Model, ModelStatic, Attributes } from "sequelize";
import * as slugService from "../services/slugService";

// Zakładam, że MyModel to jest Twój interfejs/model bazowy, jeśli nie, to zmień nazwę na odpowiednią.
export interface MyModel extends Model {
  slug: string;
  content: Record<string, any>;
}

export const getOneBySlug =
  <T extends Model>(model: ModelStatic<T>, modelName: string) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const item = await slugService.findOneBySlug(model, req.params.slug);
      if (item) {
        res.json(item);
      } else {
        res.status(404).json({ error: `${modelName} not found`});
      }
    } catch (err) {
      next(err);
    }
  };

export const updateOneBySlug =
  <T extends Model>(model: ModelStatic<T>, modelName: string) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const [updatedCount, updatedItems] = await slugService.updateBySlug(
        model,
        req.params.slug,
        req.body
      );
      if (updatedCount > 0 && updatedItems) {
        res.json(updatedItems[0]);
      } else {
        res.status(404).json({ error: `${modelName} not found`});
      }
    } catch (err) {
      next(err);
    }
  };

export const updateContentBySlug =
  <T extends MyModel>(model: ModelStatic<T>, modelName: string) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { key, value } = req.body;

      if (!key || value === undefined) {
        return res.status(404).json({ error: `Key and value are required`});
        
      }

      const item = await model.findOne({
        where: { slug: req.params.slug as Attributes<T>["slug"] },
      });

      if (!item) {
        console.log(`${modelName} not found`);
        return res.status(404).json(`${modelName} not found`);
      }

      // Zaktualizuj tylko wybrany klucz w obiekcie content
      const updatedContent = {
        ...item.content,
        [key]: value,
      };

      item.content = updatedContent;
      await item.save();

      res.json({ [modelName]: item });
    } catch (err) {
      next(err);
    }
  };

import { Request, Response, NextFunction } from "express";
import * as crudService from "../services/crudService";
import { Model, ModelStatic } from "sequelize";
import pluralize from "pluralize";
import { RequestWithUser } from "../middleware/verifyToken";

export const getAll =
  <T extends Model>(model: ModelStatic<T>, modelName: string) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pluralizedName = pluralize(modelName);
      const items = await crudService.findAll(model);
      res.json({ [`${pluralizedName}`]: items });
    } catch (err) {
      next(err);
    }
  };

export const getAllByForeignKey =
  <T extends Model>(
    model: ModelStatic<T>,
    modelName: string,
    foreignKey: keyof T
  ) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const foreignKeyValue = req.params.id;
      const pluralizedName = pluralize(modelName);
      const items = await crudService.findAllByForeignKey(
        model,
        foreignKey,
        foreignKeyValue
      );
      res.json({ [`${pluralizedName}`]: items });
    } catch (err) {
      next(err);
    }
  };

export const getOne =
  <T extends Model>(model: ModelStatic<T>, modelName: string) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const item = await crudService.findOne(model, req.params.id);
      if (item) {
        res.json({ [modelName]: item });
      } else {
        res.status(404).send(`${modelName} not found`);
      }
    } catch (err) {
      next(err);
    }
  };

export const getOneBySlug =
  <T extends Model>(model: ModelStatic<T>, modelName: string) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const item = await crudService.findOneBySlug(model, req.params.slug);
      if (item) {
        res.json({ [modelName]: item });
      } else {
        res.status(404).send(`${modelName} not found`);
      }
    } catch (err) {
      next(err);
    }
  };

export const createOne =
  <T extends Model>(model: ModelStatic<T>) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userReq = req as RequestWithUser;
      const newItem = await model.create({
        ...req.body,
        ownerId: userReq.user.id,
      });
      res.status(201).json(newItem);
    } catch (err) {
      next(err);
    }
  };

export const updateOne =
  <T extends Model>(model: ModelStatic<T>, modelName: string) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log("updateOne", model, req.params.id);
    try {
      const [updatedCount, updatedItems] = await crudService.update(
        model,
        req.params.id,
        req.body
      );
      if (updatedCount > 0 && updatedItems) {
        res.json({ [modelName]: updatedItems[0] });
      } else {
        res.status(404).send(`${modelName} not found`);
      }
    } catch (err) {
      next(err);
    }
  };

export const updateOneBySlug =
  <T extends Model>(model: ModelStatic<T>, modelName: string) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const [updatedCount, updatedItems] = await crudService.updateBySlug(
        model,
        req.params.slug,
        req.body
      );
      if (updatedCount > 0 && updatedItems) {
        res.json({ [modelName]: updatedItems[0] });
      } else {
        res.status(404).send(`${modelName} not found`);
      }
    } catch (err) {
      next(err);
    }
  };

  interface Content {
    [key: string]: any; // lub bardziej szczegółowe typy, np. string, number, itp.
  }

  export interface MyModel extends Model {
    content: Content;
  }

  export const updateContentBySlug =
  <T extends MyModel>(model: ModelStatic<T>, modelName: string) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { key, value } = req.body;

      if (!key || value === undefined) {
        return res.status(400).send("Key and value are required");
      }

      // Pobierz aktualny element
      const item = await crudService.findOneBySlug(model, req.params.slug);

      if (!item) {
        return res.status(404).send(`${modelName} not found`);
      }

      // Zaktualizuj tylko wybrany klucz w obiekcie content
      const updatedContent = {
        ...item.content,
        [key]: value,
      };

      const [updatedCount, updatedItems] = await crudService.updateBySlug(
        model,
        req.params.slug,
        { content: updatedContent }
      );

      if (updatedCount > 0 && updatedItems) {
        res.json({ [modelName]: updatedItems[0] });
      } else {
        res.status(404).send(`${modelName} not found`);
      }
    } catch (err) {
      next(err);
    }
  };


export const deleteOne =
  <T extends Model>(model: ModelStatic<T>, modelName: string) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const deletedCount = await crudService.remove(model, req.params.id);
      if (deletedCount > 0) {
        res.status(200).json({ [modelName]: req.params.id });
      } else {
        res.status(404).send(`${modelName} not found`);
      }
    } catch (err) {
      next(err);
    }
  };

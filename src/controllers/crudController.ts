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

export const createOne =
  <T extends Model>(model: ModelStatic<T>, modelName: string) =>
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userReq = req as RequestWithUser;
      const newItem = await model.create({
        ...req.body,
        ownerId: userReq.user.id,
      });

      res.status(201).json(newItem);
    } catch (error) {
      res.status(500).json({ error: `Failed to create ${modelName}` });
    }
  };

export const updateOne =
  <T extends Model>(model: ModelStatic<T>, modelName: string) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

export const deleteOne =
  <T extends Model>(model: ModelStatic<T>, modelName: string) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log("delete",model, req.params.id);

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

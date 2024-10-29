import { Request, Response, NextFunction } from "express";
import * as crudService from "../services/crudService";
import { Model, ModelStatic } from "sequelize";
import { RequestWithUser } from "../middleware/verifyToken";

export const getAll =
  <T extends Model>(model: ModelStatic<T>, modelName: string) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page, pageSize, where } = req.query;      
      const parsedPage = page ? parseInt(page as string, 10) : undefined;
      const parsedPageSize = pageSize
        ? parseInt(pageSize as string, 10)
        : undefined;

      // Pobierz odpowiedni include z pliku na podstawie modelName
      // const modelInclude = modelIncludes[modelName]?.include || [];

      const options = {
        where: where as any,
        include: (model as any).include || [], // Dynamicznie załaduj include dla modelu
        limit: parsedPageSize,
        offset:
          parsedPage && parsedPageSize
            ? (parsedPage - 1) * parsedPageSize
            : undefined,
      };

      const items = await crudService.findAll(
        model,
        options,
        parsedPage,
        parsedPageSize
      );
      res.json(items);
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
        res.json(item);
      } else {
        res.status(404).json({ error: `${modelName} not found` });
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

  export const createBulk =
  <T extends Model>(model: ModelStatic<T>) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userReq = req as RequestWithUser;
      const itemsWithOwnerId = req.body.map((item: any) => ({
        ...item,
        ownerId: userReq.user.id,
      }));

      const newItems = await model.bulkCreate(itemsWithOwnerId);
      res.status(201).json(newItems);
    } catch (err) {
      next(err);
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
        res.json(updatedItems[0]);
      } else {
        res.status(404).json({ error: `${modelName} not found` });
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
        res.status(200).json(req.params.id);
      } else {
        res.status(404).json({ error: `${modelName} not found` });
      }
    } catch (err) {
      next(err);
    }
  };

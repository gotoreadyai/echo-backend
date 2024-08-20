import { Request, Response, NextFunction } from 'express';
import * as crudService from '../services/crudService';
import { Model, ModelStatic } from 'sequelize';
import pluralize from 'pluralize';

export const getAll = <T extends Model>(model: ModelStatic<T>, modelName: string) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const pluralizedName = pluralize(modelName);
    const items = await crudService.findAll(model);
    res.json({ [`${pluralizedName}`]: items });
  } catch (err) {
    next(err);
  }
};

export const getOne = <T extends Model>(model: ModelStatic<T>, modelName: string) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

export const createOne = <T extends Model>(model: ModelStatic<T>, modelName: string) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const newItem = await crudService.create(model, req.body);
    res.status(201).json({ [modelName]: newItem });
  } catch (err) {
    next(err); 
  }
};

export const updateOne = <T extends Model>(model: ModelStatic<T>, modelName: string) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [updatedCount, updatedItems] = await crudService.update(model, req.params.id, req.body);
    if (updatedCount > 0 && updatedItems) {
      res.json({ [modelName]: updatedItems[0] });
    } else {
      res.status(404).send(`${modelName} not found`);
    }
  } catch (err) {
    next(err); 
  }
};

export const deleteOne = <T extends Model>(model: ModelStatic<T>, modelName: string) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deletedCount = await crudService.remove(model, req.params.id);
    if (deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).send(`${modelName} not found`);
    }
  } catch (err) {
    next(err); 
  }
};

// Nowa metoda kontrolera: getAllByForeignKey
export const getAllByForeignKey = <T extends Model>(
  model: ModelStatic<T>, 
  modelName: string, 
  foreignKey: keyof T
) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const foreignKeyValue = req.params[foreignKey as string];
    const pluralizedName = pluralize(modelName);
    const items = await crudService.findAllByForeignKey(model, foreignKey, foreignKeyValue);
    res.json({ [`${pluralizedName}`]: items });
  } catch (err) {
    next(err);
  }
};

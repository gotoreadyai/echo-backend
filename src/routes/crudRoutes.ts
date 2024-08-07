import express from 'express';
import { Model, ModelStatic } from 'sequelize';
import * as crudController from '../controllers/crudController';

const createCrudRoutes = <T extends Model>(model: ModelStatic<T>, modelName: string) => {
  const router = express.Router();

  router.get(`/${modelName}s`, crudController.getAll(model, modelName));
  router.get(`/${modelName}/:id`, crudController.getOne(model, modelName));
  router.post(`/${modelName}`, crudController.createOne(model, modelName));
  router.put(`/${modelName}/:id`, crudController.updateOne(model, modelName));
  router.delete(`/${modelName}/:id`, crudController.deleteOne(model, modelName));

  return router;
};

export default createCrudRoutes;

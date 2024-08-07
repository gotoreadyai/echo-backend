import express, { Router } from 'express';
import { Model, ModelStatic } from 'sequelize';
import * as crudController from '../controllers/crudController';


/**
 * createCrudRoutes is a function that creates a router for CRUD operations
 * on a given model. It takes in a model and a model name as parameters and
 * returns a router.
 *
 * @param model - a Sequelize model
 * @param modelName - a string representing the name of the model
 * @return a router object for CRUD operations on the model
 */
const createCrudRoutes = <T extends Model>(model: ModelStatic<T>, modelName: string) => {
  const router:Router = express.Router();
  router.get(`/${modelName}s`, crudController.getAll(model, modelName));
  router.get(`/${modelName}/:id`, crudController.getOne(model, modelName));
  router.post(`/${modelName}`, crudController.createOne(model, modelName));
  router.put(`/${modelName}/:id`, crudController.updateOne(model, modelName));
  router.delete(`/${modelName}/:id`, crudController.deleteOne(model, modelName));

  return router;
};

export default createCrudRoutes;

import express, { Router } from "express";
import { Model, ModelStatic } from "sequelize";
import * as crudController from "../controllers/crudController";
import pluralize from "pluralize";

/**
 * createCrudRoutes is a function that creates a router for CRUD operations
 * on a given model. It takes in a model and a model name as parameters and
 * returns a router.
 *
 * @param model - a Sequelize model
 * @param modelName - a string representing the name of the model
 * @return a router object for CRUD operations on the model
 */
const createCrudRoutes = <T extends Model>(
  model: ModelStatic<T>,
  modelName: string
) => {
  const router: Router = express.Router();
  const pluralizedName = pluralize(modelName);

  console.log(`-------------------------`);
  console.log(`GET:/${pluralizedName}`);
  console.log(`GET:/${modelName}/:id`);
  console.log(`POST:/${modelName}`);
  console.log(`PUT:/${modelName}/:id`);
  console.log(`DELETE:/${modelName}/:id`);


  

  router.get(`/${pluralizedName}`, crudController.getAll(model, modelName));
  router.get(`/${modelName}/:id`, crudController.getOne(model, modelName));
  router.post(`/${modelName}`, crudController.createOne(model, modelName));
  router.put(`/${modelName}/:id`, crudController.updateOne(model, modelName));
  router.delete(
    `/${modelName}/:id`,
    crudController.deleteOne(model, modelName)
  );

  return router;
};

export default createCrudRoutes;

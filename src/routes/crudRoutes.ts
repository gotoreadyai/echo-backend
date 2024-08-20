import express, { Router } from "express";
import { Model, ModelStatic } from "sequelize";
import * as crudController from "../controllers/crudController";
import pluralize from "pluralize";

/**
 * createCrudRoutes is a function that creates a router for CRUD operations
 * on a given model. It takes in a model and a model name as parameters and
 * returns a router.
 *
 * @param model 
 * @param modelName 
 * @return 
 */
const createCrudRoutes = <T extends Model>(
  model: ModelStatic<T>,
  modelName: string,
  foreignKey?: keyof T, 
  relatedModelName?: string 
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

 
  if (foreignKey && relatedModelName) {
    const relatedPluralizedName = pluralize(relatedModelName);
    console.log(`GET:/${relatedModelName}/:id/${pluralizedName}`);
    router.get(
      `/${relatedModelName}/:id/${pluralizedName}`,
      crudController.getAllByForeignKey(model, modelName, foreignKey)
    );
  }

  return router;
};

export default createCrudRoutes;

import express, { Router } from "express";
import { Model, ModelStatic } from "sequelize";
import * as crudController from "../controllers/crudController";
import pluralize from "pluralize";
import { verifyToken } from "../middleware/verifyToken";
import { verifyOwnership } from "../middleware/ownership";

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
  router.get(`/${pluralizedName}`, crudController.getAll(model, modelName));
  
  if (foreignKey && relatedModelName) {
    console.log(`GET:/${pluralizedName}/${relatedModelName}/:id`);
    const relatedPluralizedName = pluralize(relatedModelName);
    router.get(
      `/${pluralizedName}/${relatedModelName}/:id`,
      crudController.getAllByForeignKey(model, modelName, foreignKey)
    );
  }

  console.log(`GET:/${modelName}/:id`);
  router.get(`/${modelName}/:id`, crudController.getOne(model, modelName));

  console.log(`POST:/${modelName}`);
  router.post(`/${modelName}`, verifyToken, crudController.createOne(model, modelName));

  console.log(`PUT:/${modelName}/:id`);
  router.put(
    `/${modelName}/:id`,
    verifyToken,
    verifyOwnership, 
    crudController.updateOne(model, modelName)
  );
  
  console.log(`DELETE:/${modelName}/:id`);
  router.delete(
    `/${modelName}/:id`,
    verifyToken,
    verifyOwnership,
    crudController.deleteOne(model, modelName)
  );

  return router;
};

export default createCrudRoutes;

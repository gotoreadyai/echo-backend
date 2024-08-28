import express, { Router } from "express";
import { Model, ModelStatic } from "sequelize";
import * as crudController from "../controllers/crudController";
import pluralize from "pluralize";
import { verifyToken } from "../middleware/verifyToken";
import { verifyOwnership } from "../middleware/ownership";
import { log } from "../middleware/messagees";

const createCrudRoutes = <T extends Model>(
  model: ModelStatic<T>,
  modelName: string,
  foreignKey?: keyof T, 
  relatedModelName?: string 
) => {
  const router: Router = express.Router();
  const pluralizedName = pluralize(modelName);


  log(`CRUD ${pluralizedName}`,`gray-bg`)

  log(`GET:/${pluralizedName}`, 'blue');
  router.get(`/${pluralizedName}`, crudController.getAll(model, modelName));
  
  if (foreignKey && relatedModelName) {
    log(`GET:/${pluralizedName}/${relatedModelName}/:id`, 'blue');
    const relatedPluralizedName = pluralize(relatedModelName);
    router.get(
      `/${pluralizedName}/${relatedModelName}/:id`,
      crudController.getAllByForeignKey(model, modelName, foreignKey)
    );
  }

  log(`GET:/${modelName}/:id`, 'blue');
  router.get(`/${modelName}/:id`, crudController.getOne(model, modelName));

  log(`POST:/${modelName}`, 'green');
  router.post(`/${modelName}`, verifyToken, crudController.createOne(model, modelName));

  log(`PUT:/${modelName}/:id`, 'yellow');
  router.put(
    `/${modelName}/:id`,
    verifyToken,
    verifyOwnership, 
    crudController.updateOne(model, modelName)
  );
  
  log(`DELETE:/${modelName}/:id`, 'red');
  router.delete(
    `/${modelName}/:id`,
    verifyToken,
    verifyOwnership,
    crudController.deleteOne(model, modelName)
  );

  return router;
};

export default createCrudRoutes;

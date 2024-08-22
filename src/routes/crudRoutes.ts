import express, { Router } from "express";
import { Model, ModelStatic } from "sequelize";
import * as crudController from "../controllers/crudController";
import pluralize from "pluralize";
import { verifyToken } from "../middleware/verifyToken"; // Importuj middleware weryfikujący token

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

  console.log("\x1b[32m%s\x1b[0m", `-------------------------`);

  console.log("\x1b[32m%s\x1b[0m",`GET:/${pluralizedName}`);
  router.get(`/${pluralizedName}`, crudController.getAll(model, modelName));

  if (foreignKey && relatedModelName) {
    console.log('\x1b[32m%s\x1b[0m',`GET:/${pluralizedName}/${relatedModelName}/:id`);
    const relatedPluralizedName = pluralize(relatedModelName);
    router.get(
      `/${pluralizedName}/${relatedModelName}/:id`,
      crudController.getAllByForeignKey(model, modelName, foreignKey)
    );
  }

  console.log('\x1b[32m%s\x1b[0m',`GET:/${modelName}/:id`);
  router.get(`/${modelName}/:id`, crudController.getOne(model, modelName));

  console.log('\x1b[34m%s\x1b[0m',`POST:/${modelName}`);
  router.post(
    `/${modelName}`,
    verifyToken,
    crudController.createOne(model, modelName)
  );

  console.log('\x1b[34m%s\x1b[0m',`PUT:/${modelName}/:id`);
  router.put(`/${modelName}/:id`, crudController.updateOne(model, modelName));

  console.log('\x1b[31m%s\x1b[0m',`DELETE:/${modelName}/:id`);
  router.delete(
    `/${modelName}/:id`,
    verifyToken, // Dodaj middleware weryfikujący token dla operacji DELETE
    crudController.deleteOne(model, modelName)
  );

  return router;
};

export default createCrudRoutes;

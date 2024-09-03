import express, { Router } from "express";
import { Model, ModelStatic } from "sequelize";
import * as crudController from "../controllers/crudController";
import pluralize from "pluralize";
import { verifyToken } from "../middleware/verifyToken";
import { verifyOwnership } from "../middleware/ownership";
import { log } from "../middleware/messagees";
import { MyModel } from "../controllers/crudController";

const createCrudRoutes = <T extends MyModel>(
  model: ModelStatic<T>,
  modelName: string,
  foreignKey?: keyof T,
  relatedModelName?: string,
  hasSlug?: boolean // Optional flag to indicate if the model uses slugs
) => {
  const router: Router = express.Router();
  const pluralizedName = pluralize(modelName);

  router.get(`/${pluralizedName}`, crudController.getAll(model, modelName));

  if (foreignKey && relatedModelName) {
    const relatedPluralizedName = pluralize(relatedModelName);
    router.get(
      `/${pluralizedName}/${relatedModelName}/:id`,
      crudController.getAllByForeignKey(model, modelName, foreignKey)
    );
  }

  router.get(`/${modelName}/:id`, crudController.getOne(model, modelName));

  hasSlug &&
    router.get(
      `/${modelName}/slug/:slug`,
      crudController.getOneBySlug(model, modelName)
    );

  hasSlug &&
    router.put(
      `/${modelName}/slug/:slug`,
      verifyToken,
      verifyOwnership(model),
      crudController.updateOneBySlug(model, modelName)
    );

    router.post(
      `/${modelName}/slug/:slug/content`,
      verifyToken,
      verifyOwnership(model),
      crudController.updateContentBySlug(model, modelName)
    );

  router.post(`/${modelName}`, verifyToken, crudController.createOne(model));

  router.put(
    `/${modelName}/:id`,
    verifyToken,
    verifyOwnership(model),
    crudController.updateOne(model, modelName)
  );

  router.delete(
    `/${modelName}/:id`,
    verifyToken,
    verifyOwnership(model),
    crudController.deleteOne(model, modelName)
  );

  log(`CRUD ${pluralizedName}`, `gray-bg`);
  log(`GET:/${pluralizedName}`, "blue");
  log(`GET:/${modelName}/:id`, "blue");
  foreignKey &&
    relatedModelName &&
    log(`GET:/${pluralizedName}/${relatedModelName}/:id`, "blue");
  hasSlug && log(`GET:/${modelName}/slug/:slug`, "blue");
  hasSlug && log(`PUT:/${modelName}/slug/:slug`, "yellow");
  log(`POST:/${modelName}`, "green");
  log(`PUT:/${modelName}/:id`, "yellow");
  log(`DELETE:/${modelName}/:id`, "red");

  return router;
};

export default createCrudRoutes;

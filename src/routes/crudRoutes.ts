import express, { Router } from "express";
import { Model, ModelStatic } from "sequelize";
import * as crudController from "../controllers/crudController";
import pluralize from "pluralize";
import { verifyToken } from "../middleware/verifyToken";
import { verifyOwnership } from "../middleware/ownership";

const createCrudRoutes = <T extends Model>(
  model: ModelStatic<T>,
  modelName: string
) => {
  const router: Router = express.Router();
  const pluralizedName = pluralize(modelName);
  router.get(`/${pluralizedName}`, crudController.getAll(model, modelName));
  router.get(`/${modelName}/:id`, crudController.getOne(model, modelName));
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

  router.put(
    `/${pluralizedName}/bulk/`,
    verifyToken,
    verifyOwnership(model),
    crudController.createBulk(model)
  )

  return router;
};

export default createCrudRoutes;

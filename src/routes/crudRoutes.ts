import express, { Router } from "express";
import { Includeable, Model, ModelStatic } from "sequelize";
import * as crudController from "../controllers/crudController";
import pluralize from "pluralize";
import { verifyToken } from "../middleware/verifyToken";
import { verifyOwnership } from "../middleware/ownership";

import { Workspace } from "../models";

type IncludeableOption = Includeable;

const createCrudRoutes = <T extends Model>(
  model: ModelStatic<T>,
  modelName: string,
 
) => {
  const router: Router = express.Router();
  const pluralizedName = pluralize(modelName);

  const allowedIncludes: IncludeableOption[] =
  modelName.toLowerCase() === "document"
    ? [
        { model: Workspace, as: "workspace" },
      ]
    : [];
  router.get(`/${pluralizedName}`, crudController.getAll(model, modelName ));



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


  

  return router;
};

export default createCrudRoutes;

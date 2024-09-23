import  { Router } from "express";
import { ModelStatic } from "sequelize";
import { getOneBySlug, updateOneBySlug, updateContentBySlug } from "../controllers/slugController";
import { verifyToken } from "../middleware/verifyToken";
import { verifyOwnershipBySlug } from "../middleware/ownership";
import { MyModel } from "../controllers/slugController"; 

export const createSlugRoutes = <T extends MyModel>(
  model: ModelStatic<T>, 
  modelName: string
) => {
  const router: Router = Router();

  router.get(`/${modelName}/slug/:slug`, getOneBySlug(model, modelName));
  router.put(
    `/${modelName}/slug/:slug`,
    verifyToken,
    verifyOwnershipBySlug(model, "slug"),
    updateOneBySlug(model, modelName)
  );

  router.put(
    `/${modelName}/slug/:slug/content`,
    verifyToken,
    verifyOwnershipBySlug(model, "slug"),
    updateContentBySlug(model, modelName)
  );

  return router;
};
export default createSlugRoutes;

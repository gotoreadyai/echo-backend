import { Request, Response, NextFunction, RequestHandler } from 'express';
import { Model, ModelStatic, WhereOptions } from 'sequelize';
import { RequestWithUser } from '../middleware/verifyToken';

export const verifyOwnership = <T extends Model>(
  model: ModelStatic<T>
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const resourceId = req.params.id;
    const userId = (req as RequestWithUser).user.id;
    const userRole = (req as RequestWithUser).user.role;
    
    try {
      const resource = await model.findByPk(resourceId);
      if (!resource) {
        return res.status(404).json({ error: `${model.name} not found` });
      }

      if (userRole === 'admin') {
        // Admin users have access to all resources
        return next();
      }

      const ownerId = (resource as any).ownerId;
      if (ownerId !== userId) {
        return res.status(403).json({ error: `You are not the owner of this ${model.name.toLowerCase()}` });
      }

      next();
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
};


export const verifyOwnershipBySlug = <T extends Model>(
  model: ModelStatic<T>,
  slugField: keyof T
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;
    const userId = (req as RequestWithUser).user.id;
    const userRole = (req as RequestWithUser).user.role;
    
    try {
      // Define the where condition using the proper typing
      const whereCondition: WhereOptions = {
        [slugField as string]: slug,
      };

      // Find the resource by slug
      const resource = await model.findOne({ where: whereCondition });

      if (!resource) {
        return res.status(404).json({ error: `${model.name} not found` });
      }

      // Admin users have access to all resources
      if (userRole === 'admin') {
        return next();
      }

      // Check if the current user is the owner of the resource
      const ownerId = (resource as any).ownerId;
      if (ownerId !== userId) {
        return res.status(403).json({ error: `You are not the owner of this ${model.name.toLowerCase()}` });
      }

      next();
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
};


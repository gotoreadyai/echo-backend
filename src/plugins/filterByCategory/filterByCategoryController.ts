import { Request, Response, NextFunction } from 'express';
import * as filterByCategoryService from './filterByCategoryService';

export const getDocumentsByCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryId } = req.query;
    if (!categoryId) {
      return res.status(400).json({ error: 'categoryId query parameter is required' });
    }
    const documents = await filterByCategoryService.findDocumentsByCategory(categoryId as string);
    res.json({ documents });
  } catch (err) {
    next(err);
  }
};

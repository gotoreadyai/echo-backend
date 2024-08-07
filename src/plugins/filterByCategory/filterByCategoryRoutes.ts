import { Router } from 'express';
import * as filterByCategoryController from './filterByCategoryController';

const router = Router();

router.get('/documents/byCategory', filterByCategoryController.getDocumentsByCategory);

export default router;

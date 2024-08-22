import { Request, Response, NextFunction, RequestHandler } from 'express';
import Document from '../models/document';
import { RequestWithUser } from '../middleware/verifyToken';

export const verifyOwnership: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const documentId = req.params.id;
  
  // Rzutujemy `req` na `RequestWithUser` aby użyć `user`
  const userId = (req as RequestWithUser).user.id;
  const userRole = (req as RequestWithUser).user.role;

  try {
    const document = await Document.findByPk(documentId);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Jeśli użytkownik jest administratorem, pozwalamy mu na edycję/usunięcie
    if (userRole === 'admin') {
      return next();
    }

    // Jeśli użytkownik nie jest właścicielem dokumentu, odrzucamy żądanie
    if (document.ownerId !== userId) {
      return res.status(403).json({ error: 'You are not the owner of this document' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

import { Router, Request, Response, NextFunction } from 'express';
import { RowDataPacket, OkPacket } from 'mysql2';
import { db } from '../config/db';
import { authenticate } from '../middleware/auth';

interface AuthRequest extends Request {
  userId?: string;
  userRole?: 'user' | 'admin';
}

const router = Router();

/**
 * GET /api/users
 * Список всех пользователей (только админ)
 */
router.get(
  '/',
  authenticate,
  async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reqAuth = _req as AuthRequest;
      if (reqAuth.userRole !== 'admin') {
        res.status(403).json({ success: false, message: 'Forbidden' });
        return;
      }
      const [rows] = await db.query<RowDataPacket[]>(
        `SELECT 
           id,
           email,
           name,
           role,
           phone,
           avatar,
           created_at AS createdAt
         FROM users`
      );
      res.json({ success: true, data: rows });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PUT /api/users/:id
 * Обновить данные пользователя (только админ)
 */
router.put(
  '/:id',
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.userRole !== 'admin') {
        res.status(403).json({ success: false, message: 'Forbidden' });
        return;
      }
      const { id } = req.params;
      await db.query<OkPacket>(
        'UPDATE users SET ? WHERE id = ?',
        [req.body, id]
      );
      res.json({ success: true, data: { id, ...req.body } });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /api/users/:id
 * Удалить пользователя (только админ)
 */
router.delete(
  '/:id',
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.userRole !== 'admin') {
        res.status(403).json({ success: false, message: 'Forbidden' });
        return;
      }
      const { id } = req.params;
      await db.query<OkPacket>(
        'DELETE FROM users WHERE id = ?',
        [id]
      );
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
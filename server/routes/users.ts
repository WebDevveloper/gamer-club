import { Router, Request, Response, NextFunction } from 'express';
import type { RowDataPacket, OkPacket } from 'mysql2';
import { db } from '../config/db';
import authenticate, { AuthRequest } from '../middleware/auth';

const router = Router();

/**
 * GET /api/users
 * Список всех пользователей (доступно только админу)
 */
router.get(
  '/',
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Проверяем роль из req.user, который кладёт middleware authenticate
      if (req.user!.role !== 'admin') {
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
      return;
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PUT /api/users/:id
 * Админ может менять любого; пользователь — только свой профиль (name, phone)
 */
router.put(
  '/:id',
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const currentUser = req.user!;
      const targetId    = Number(req.params.id);

      // Если не админ и пытается править чужой профиль — 403
      if (currentUser.role !== 'admin' && currentUser.userId !== targetId) {
        res.status(403).json({ success: false, message: 'Forbidden' });
        return;
      }

      // Собираем объект обновлений
      let updates: Record<string, any>;
      if (currentUser.role === 'admin') {
        updates = { ...req.body };
      } else {
        // Обычный пользователь может менять только имя и телефон
        updates = {
          name:  req.body.name,
          phone: req.body.phone,
        };
      }
      // Никому не даём менять role или email
      delete updates.role;
      delete updates.email;

      await db.query<OkPacket>(
        'UPDATE users SET ? WHERE id = ?',
        [updates, targetId]
      );

      res.json({
        success: true,
        data: { id: targetId, ...updates }
      });
      return;
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /api/users/:id
 * Удаление пользователя (только админ)
 */
router.delete(
  '/:id',
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.user!.role !== 'admin') {
        res.status(403).json({ success: false, message: 'Forbidden' });
        return;
      }

      const targetId = Number(req.params.id);
      await db.query<OkPacket>(
        'DELETE FROM users WHERE id = ?',
        [targetId]
      );

      res.json({ success: true });
      return;
    } catch (err) {
      next(err);
    }
  }
);

export default router;
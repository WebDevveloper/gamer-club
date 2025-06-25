import { Router, Request, Response, NextFunction } from 'express';
import { RowDataPacket, OkPacket } from 'mysql2';
import { db } from '../config/db';
import authenticate from '../middleware/auth';
import { generateId } from '../utils/generateId';

interface AuthRequest extends Request {
  userId?: string;
  userRole?: 'user' | 'admin';
}

const router = Router();

// 1) Список компьютеров (всем авторизованным)
router.get(
  '/',
  authenticate,
  async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const [computers] = await db.query<RowDataPacket[]>(
        'SELECT * FROM computers'
      );
      res.json({ success: true, data: computers });
      return;
    } catch (err) {
      next(err);
    }
  }
);

// 2) Детали одного компьютера
router.get(
  '/:id',
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const [rows] = await db.query<RowDataPacket[]>(
        'SELECT * FROM computers WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        res.status(404).json({ success: false, message: 'Computer not found' });
        return;
      }

      res.json({ success: true, data: rows[0] });
      return;
    } catch (err) {
      next(err);
    }
  }
);

// 3) Создать компьютер (только admin)
router.post(
  '/',
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.userRole !== 'admin') {
        res.status(403).json({ success: false, message: 'Forbidden' });
        return;
      }

      const id = generateId();
      const {
        name,
        type,
        cpu,
        gpu,
        ram,
        storage,
        monitor,
        status,
        hourly_rate,
        image,
      } = req.body as {
        name: string;
        type: 'gaming' | 'standard' | 'premium';
        cpu: string;
        gpu: string;
        ram: string;
        storage: string;
        monitor: string;
        status: 'available' | 'booked' | 'maintenance';
        hourly_rate: number;
        image?: string;
      };

      await db.query<OkPacket>(
        `INSERT INTO computers 
           (id,name,type,cpu,gpu,ram,storage,monitor,status,hourly_rate,image)
         VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
        [id, name, type, cpu, gpu, ram, storage, monitor, status, hourly_rate, image]
      );

      res.status(201).json({
        success: true,
        data: { id, name, type, cpu, gpu, ram, storage, monitor, status, hourly_rate, image },
      });
      return;
    } catch (err) {
      next(err);
    }
  }
);

// 4) Обновить компьютер (только admin)
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
      await db.query<OkPacket>('UPDATE computers SET ? WHERE id = ?', [
        req.body,
        id,
      ]);

      res.json({ success: true, data: { id, ...req.body } });
      return;
    } catch (err) {
      next(err);
    }
  }
);

// 5) Удалить компьютер (только admin)
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
      await db.query<OkPacket>('DELETE FROM computers WHERE id = ?', [id]);

      res.json({ success: true });
      return;
    } catch (err) {
      next(err);
    }
  }
);

export default router;

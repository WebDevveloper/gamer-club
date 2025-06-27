import { Router, Response, NextFunction } from 'express';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { db } from '../config/db';
import authenticate, { AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/bookings — список броней (только свои для пользователя, все — для админа)
router.get(
  '/',
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const role   = req.user!.role;

      let sql = `
        SELECT 
          b.id,
          b.user_id     AS userId,
          b.computer_id AS computerId,
          b.start_time  AS startTime,
          b.end_time    AS endTime,
          b.status,
          b.total_price AS totalPrice,
          c.name        AS computerName,
          c.image       AS computerImage
        FROM bookings b
        JOIN computers c ON b.computer_id = c.id
      `;
      const params: any[] = [];
      if (role !== 'admin') {
        sql  += ' WHERE b.user_id = ?';
        params.push(userId);
      }

      const [rows] = await db.query<RowDataPacket[]>(sql, params);
      res.json({ success: true, data: rows });
      return;
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/bookings — создать новую бронь и сразу подтвердить её
router.post(
  '/',
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { computerId, startTime, endTime } = req.body as {
        computerId: number;
        startTime: string;
        endTime: string;
      };

      // Проверка корректности дат
      const start = new Date(startTime);
      const end   = new Date(endTime);
      if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
        res.status(400).json({ success: false, message: 'Invalid dates' });
        return;
      }

      // Проверяем доступность и ставку компьютера
      const [compRows] = await db.query<RowDataPacket[]>(
        'SELECT status, hourly_rate FROM computers WHERE id = ?',
        [computerId]
      );
      const comp = compRows[0];
      if (!comp) {
        res.status(404).json({ success: false, message: 'Computer not found' });
        return;
      }
      if (comp.status !== 'available') {
        res.status(400).json({ success: false, message: 'Not available' });
        return;
      }

      // Вычисляем цену
      const ms    = end.getTime() - start.getTime();
      const hours = ms / (1000 * 60 * 60);
      const price = +(hours * comp.hourly_rate).toFixed(2);

      // Вставляем бронь
      const [insertResult] = await db.query<ResultSetHeader>(
        `INSERT INTO bookings
           (user_id, computer_id, start_time, end_time, total_price)
         VALUES (?,       ?,           ?,          ?,         ?)`,
        [userId, computerId, start, end, price]
      );

      // Обновляем статус компьютера
      await db.query(
        'UPDATE computers SET status = ? WHERE id = ?',
        ['booked', computerId]
      );

      // Возвращаем созданный объект
      res.json({
        success: true,
        data: {
          id:          insertResult.insertId,
          userId,
          computerId,
          startTime:   start.toISOString(),
          endTime:     end.toISOString(),
          totalPrice:  price,
          status:      'confirmed',
        }
      });
      return;
    } catch (err) {
      next(err);
    }
  }
);

export default router;
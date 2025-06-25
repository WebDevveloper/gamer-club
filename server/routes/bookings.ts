import { Router, Response } from 'express';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { db } from '../config/db';
import authenticate, { AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/bookings — list this user’s bookings
router.get(
  '/',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const role   = req.user!.role;

    let sql = `
      SELECT 
        b.id,
        b.user_id    AS userId,
        b.computer_id AS computerId,
        b.start_time AS startTime,
        b.end_time   AS endTime,
        b.status,
        b.total_price AS totalPrice,
        c.name  AS computerName,
        c.image AS computerImage
      FROM bookings b
      JOIN computers c ON b.computer_id = c.id
    `;
    const params: any[] = [];
    if (role !== 'admin') {
      sql += ' WHERE b.user_id = ?';
      params.push(userId);
    }

    const [rows] = await db.query<RowDataPacket[]>(sql, params);
    res.json({ success: true, data: rows });
  }
);

// POST /api/bookings — create & immediately “confirm” a booking
router.post(
  '/',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId     = req.user!.userId;
      const { computerId, startTime, endTime } = req.body as {
        computerId: number;
        startTime: string;
        endTime: string;
      };

      const start = new Date(startTime);
      const end   = new Date(endTime);
      if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
        res.status(400).json({ success: false, message: 'Invalid dates' });
        return;
      }

      // fetch rate & availability
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

      // calculate price
      const ms     = end.getTime() - start.getTime();
      const hours  = ms / (1000 * 60 * 60);
      const price  = +(hours * comp.hourly_rate).toFixed(2);

      // insert booking
      const [r] = await db.query<ResultSetHeader>(
        `INSERT INTO bookings
           (user_id, computer_id, start_time, end_time, total_price)
         VALUES (?,       ?,           ?,          ?,         ?)`,
        [userId, computerId, start, end, price]
      );

      // mark computer booked
      await db.query(
        'UPDATE computers SET status = ? WHERE id = ?',
        ['booked', computerId]
      );

      res.json({
        success: true,
        data: {
          id:          r.insertId,
          userId,
          computerId,
          startTime:   start.toISOString(),
          endTime:     end.toISOString(),
          totalPrice:  price,
          status:      'confirmed',
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

export default router;

import { Router, Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { db } from '../config/db';
import { authenticate } from '../middleware/auth';

interface AuthRequest extends Request {
  userId?: number;
  userRole?: string;
}

const router = Router();

// GET /api/bookings
router.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const role = req.userRole!;
    let sql = `
      SELECT b.id, b.user_id AS userId, u.name AS userName,
             b.computer_id AS computerId, c.name AS computerName,
             b.start_time AS startTime, b.end_time AS endTime,
             b.status, b.total_price AS totalPrice
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN computers c ON b.computer_id = c.id
    `;
    const params: (number | string)[] = [];
    if (role !== 'admin') {
      sql += ' WHERE b.user_id = ?';
      params.push(userId);
    }
    const [rows] = await db.query<RowDataPacket[]>(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/bookings
router.post('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { computerId, startTime, endTime } = req.body as {
      computerId: number;
      startTime: string;
      endTime: string;
    };

    if (!computerId || !startTime || !endTime) {
      res.status(400).json({ success: false, message: 'Missing fields' });
      return;
    }

    const [compRows] = await db.query<RowDataPacket[]>(
      'SELECT hourly_rate FROM computers WHERE id = ?',
      [computerId]
    );
    if (compRows.length === 0) {
      res.status(404).json({ success: false, message: 'Computer not found' });
      return;
    }
    const hourlyRate = compRows[0].hourly_rate;
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (end <= start) {
      res.status(400).json({ success: false, message: 'End time must be after start time' });
      return;
    }
    const hours = (end.getTime() - start.getTime()) / 36e5;
    const totalPrice = parseFloat((hourlyRate * hours).toFixed(2));

    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO bookings 
         (user_id, computer_id, start_time, end_time, total_price)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, computerId, startTime, endTime, totalPrice]
    );
    const bookingId = result.insertId;

    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT b.id, b.user_id AS userId, u.name AS userName,
              b.computer_id AS computerId, c.name AS computerName,
              b.start_time AS startTime, b.end_time AS endTime,
              b.status, b.total_price AS totalPrice
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN computers c ON b.computer_id = c.id
       WHERE b.id = ?`,
      [bookingId]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/bookings/:id
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bookingId = Number(req.params.id);
    const userId = req.userId!;
    const role = req.userRole!;

    if (role !== 'admin') {
      const [ownerRows] = await db.query<RowDataPacket[]>(
        'SELECT user_id FROM bookings WHERE id = ?', 
        [bookingId]
      );
      if (!ownerRows.length) {
        res.status(404).json({ success: false, message: 'Booking not found' });
        return;
      }
      if (ownerRows[0].user_id !== userId) {
        res.status(403).json({ success: false, message: 'Forbidden' });
        return;
      }
    }

    await db.query('UPDATE bookings SET status = ? WHERE id = ?', ['cancelled', bookingId]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;

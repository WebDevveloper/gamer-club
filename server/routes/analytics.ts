import { Router } from 'express';
import { RowDataPacket } from 'mysql2';
import { db } from '../config/db';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res) => {
  if (req.user!.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Forbidden' });
    return;
  }

  // Tell TypeScript that rows is an array of objects with these two fields
  const [rows] = await db.query<
    (RowDataPacket & { totalBookings: number; totalRevenue: number })[]
  >(
    `SELECT
       COUNT(*) AS totalBookings,
       SUM(total_price) AS totalRevenue
     FROM bookings;`
  );

  // rows is now typed as Array<{ totalBookings: number; totalRevenue: number }>
  const stats = rows[0] ?? { totalBookings: 0, totalRevenue: 0 };
  res.json({ success: true, data: stats });
});

export default router;
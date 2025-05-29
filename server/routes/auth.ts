import { Router, Request, Response, NextFunction  } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/db"          // ваш mysql2-пул с promise
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "replace_this_secret";

// --- Регистрация
router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password, name } = req.body;
      if (!email || !password || !name) {
        res.status(400).json({ success: false, message: "Missing fields" });
        return;
      }

      // Check existing
      const [existing]: any = await db.query(
        "SELECT id FROM users WHERE email = ?",
        [email]
      );
      if (existing.length > 0) {
        res.status(409).json({ success: false, message: "Email in use" });
        return;
      }

      // Hash password
      const hash = await bcrypt.hash(password, 10);
      const [result]: any = await db.query(
        "INSERT INTO users (email,password,name,role) VALUES (?,?,?,'user')",
        [email, hash, name]
      );

      // Issue token
      const token = jwt.sign(
        { userId: result.insertId, role: "user" },
        JWT_SECRET,
        { expiresIn: "12h" }
      );

      res.json({
        success: true,
        data: {
          user: { id: result.insertId, email, name, role: "user" },
          token,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// --- Логин
router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ success: false, message: "Missing fields" });
        return;
      }

      // Lookup user
      const [rows]: any = await db.query(
        "SELECT id, password, name, role FROM users WHERE email = ?",
        [email]
      );
      if (rows.length === 0) {
        res.status(401).json({ success: false, message: "Invalid credentials" });
        return;
      }

      const user = rows[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        res.status(401).json({ success: false, message: "Invalid credentials" });
        return;
      }

      // Issue token
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: "12h" }
      );

      res.json({
        success: true,
        data: {
          user: { id: user.id, email, name: user.name, role: user.role },
          token,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// --- Маршрут «узнать кто я»
router.get(
  "/me",
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const [rows]: any = await db.query(
        "SELECT id, email, name, role, phone, avatar, created_at FROM users WHERE id = ?",
        [userId]
      );
      if (rows.length === 0) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }
      res.json({ success: true, data: rows[0] });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
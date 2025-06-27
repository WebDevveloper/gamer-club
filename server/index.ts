import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

import authRouter from "./routes/auth";
import usersRouter from "./routes/users";
import computersRouter from "./routes/computers";
import bookingsRouter from "./routes/bookings";
import analyticsRouter from "./routes/analytics";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/computers", computersRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/analytics", analyticsRouter);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
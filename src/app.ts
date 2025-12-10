import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import authRoutes from "./routes/auth.route";
import jobRoutes from "./routes/job.routes";

import ApplicationRoutes from "./routes/application.route";
import adminRoutes from "./routes/admin.route";
const app = express();
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/job", jobRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/application", ApplicationRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Job portal website",
  });
});

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({ success: false, message: "Server error" });
});

export default app;

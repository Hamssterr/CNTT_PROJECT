import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import { connectDB } from "./Src/lib/db.js"; // Import kết nối DB
import authRoutes from "./Src/routes/auth.routes.js";
import studentRoutes from "./Src/routes/student.routes.js";
import parentRoutes from "./Src/routes/parent.routes.js";
import adminRoutes from "./Src/routes/admin.routes.js";
import courseRoutes from "./Src/routes/course.routes.js";
import teacherRoutes from "./Src/routes/teacher.routes.js";
import consultantRouter from "./Src/routes/consultant.routes.js";
import financeRouter from "./Src/routes/finance.routes.js";
import bannerRoutes from "./Src/routes/banner.routes.js";
import classRoutes from "./Src/routes/class.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// Cấu hình CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Credentials",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposedHeaders: ["set-cookie"],
};

app.use(cors(corsOptions));
app.use(helmet({ contentSecurityPolicy: false, hidePoweredBy: true }));
app.use(express.json());
app.use(cookieParser());

// **Chỉ dùng body-parser nếu cần đọc JSON, không dùng khi upload file**
app.use(bodyParser.json());

// Định tuyến API
app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/parent", parentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/consultant", consultantRouter);
app.use("/api/academic-finance", financeRouter);
app.use("/api/banner", bannerRoutes);
app.use("/api/class", classRoutes);

// Middleware xử lý lỗi chung
app.use((req, res, next) => {
  // Lấy token từ cookie hoặc Authorization header
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (token) {
    req.headers.authorization = `Bearer ${token}`;
  }
  next();
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is running on PORT:", PORT);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
  });

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
import adminRoutes from "./Src/routes/admin.routes.js";
import courseRoutes from "./Src/routes/course.routes.js";
import teacherRoutes from "./Src/routes/teacher.routes.js";
import consultantRouter from "./Src/routes/consultant.routes.js";
import financeRouter from "./Src/routes/finance.routes.js";
import bannerRoutes from "./Src/routes/banner.routes.js";

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
app.use("/api/admin", adminRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/consultant", consultantRouter);
app.use("/api/academic-finance", financeRouter);
app.use("/api/banner", bannerRoutes);

app.get("/", async (req, res) => {
  const dbStatus = mongoose.connection.readyState; // 0 = disconnected, 1 = connected

  let statusText = "Unknown";
  switch (dbStatus) {
    case 0:
      statusText = "Disconnected";
      break;
    case 1:
      statusText = "Connected";
      break;
    case 2:
      statusText = "Connecting";
      break;
    case 3:
      statusText = "Disconnecting";
      break;
  }

  res.status(200).json({
    message: "Welcome to the API",
    dbConnection: statusText,
    dbReadyState: dbStatus,
    mongoURI: process.env.MONGODB_URI || "Null",
  });
});

// Middleware xử lý lỗi chung
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
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

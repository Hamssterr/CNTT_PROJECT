import express from "express";
import cookieParser from "cookie-parser"; 
import dotenv from 'dotenv';
import helmet from 'helmet'; 
import cors from 'cors';
import bodyParser from "body-parser";

import {connectDB} from "./lib/db.js";
import authRoutes from "./routes/auth.routes.js";
import studentRoutes from "./routes/student.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import courseRoutes from "./routes/course.routes.js";
import teacherRoutes from "./routes/teacher.routes.js"
import consultantRouter from "./routes/consultant.routes.js";
import financeRouter from "./routes/finance.routes.js";
import bannerRoutes from "./routes/banner.routes.js"

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// Cấu hình CORS
const corsOptions = {
  origin: "http://localhost:5173",
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

// Middleware xử lý lỗi chung
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

app.listen(PORT, () => {
    console.log("Server is running on PORT: " + PORT);
    connectDB();
});

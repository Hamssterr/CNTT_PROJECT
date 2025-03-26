import express from "express";
import cookieParser from "cookie-parser"; 
import dotenv from 'dotenv';
// using helmet to protect header HTTP
import helmet from 'helmet'; 
import cors from 'cors'

import {connectDB} from "./lib/db.js"
import authRoutes from "./routes/auth.routes.js"
import studentRoutes from "./routes/student.routes.js"
import adminRoutes from "./routes/admin.routes.js"

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8080;

const corsOptions = {
  origin: "http://localhost:5173", // Frontend origin
  credentials: true, // Cho phép gửi cookie
  allowedHeaders: [
    "Content-Type",
    "Authorization", // Đảm bảo Authorization được phép
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Credentials",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Các phương thức được phép
  exposedHeaders: ["set-cookie"], // Nếu cần expose cookie
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use(helmet({
  contentSecurityPolicy: false, // Tắt CSP nếu không cần thiết
  hidePoweredBy: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);


app.use((err, req, res, next) => {
    console.error("Unhandled error:", err.stack);
    res.status(500).json({ message: "Something went wrong!" });
  });

app.listen(PORT, () => {
    console.log("Server is running on PORT: " + PORT);
    connectDB();
})
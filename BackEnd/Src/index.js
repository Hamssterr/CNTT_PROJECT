import express from "express";
import cookieParser from "cookie-parser"; 
import dotenv from 'dotenv';
// using helmet to protect header HTTP
import helmet from 'helmet'; 

import {connectDB} from "./lib/db.js"
import authRoutes from "./routes/auth.routes.js"
import studentRoutes from "./routes/student.routes.js"

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);


app.use((err, req, res, next) => {
    console.error("Unhandled error:", err.stack);
    res.status(500).json({ message: "Something went wrong!" });
  });

app.listen(PORT, () => {
    console.log("Server is running on PORT: " + PORT);
    connectDB();
})
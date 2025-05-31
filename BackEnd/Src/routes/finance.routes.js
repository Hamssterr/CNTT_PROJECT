import express from "express";

import {
  getClasses,
  addNewClass,
  deleteClass,
  updateClass,
  checkTeacherAvailability,
} from "../controller/classFinance.controller.js";
import {
  getTeachers,
  addNewTeacher,
  updateTeacher,
} from "../controller/teacherFinance.controller.js";
import { verifyFinance } from "../middleware/verifyFinance.js";
import { getAttendanceReports } from "../controller/attendance.controller.js";

import {getPersonalData, updateUserProfile} from "../controller/auth.controller.js"

import { cloudinaryFileUploader } from "../middleware/FileUploader.js";

const financeRouter = express.Router();

// Personal Data 
financeRouter.get("/profile", verifyFinance ,getPersonalData);

financeRouter.put("/profile", verifyFinance, cloudinaryFileUploader.single("profileImage"), updateUserProfile)

// 
financeRouter.get("/getClasses", verifyFinance, getClasses);
financeRouter.post("/addNewClass", verifyFinance, addNewClass);
financeRouter.delete("/deleteClass/:id", verifyFinance, deleteClass);
financeRouter.put("/updateClass/:id", verifyFinance, updateClass);

financeRouter.get("/getTeachers", verifyFinance, getTeachers);
financeRouter.post("/addNewTeacher", verifyFinance, addNewTeacher);
financeRouter.put("/updateTeacher/:id", verifyFinance, updateTeacher);
financeRouter.post(
  "/checkTeacherAvailability",
  verifyFinance,
  checkTeacherAvailability
);
financeRouter.get("/report", getAttendanceReports);
export default financeRouter;

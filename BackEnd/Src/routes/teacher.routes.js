import express, { Router } from "express";

import {
  deleteNotification,
  getMyCourses,
  getNotifications,
  markAllAsRead,
  markAsRead,
  saveAttendance,
} from "../controller/teacher.controller.js";
import {
  getClassesById,
  getClassesByInstructor,
} from "../controller/class.controller.js";
import { verifyTeacher } from "../middleware/verifyTeacher.js";
import { deleteMaterial } from "../controller/class.controller.js";

import {
  getPersonalData,
  updateUserProfile,
  updatePassword,
} from "../controller/auth.controller.js";

import { cloudinaryFileUploader } from "../middleware/FileUploader.js";

const router = express.Router();

// Update password
router.patch("/update-password", verifyTeacher, updatePassword);

// Personal Data
router.get("/profile", verifyTeacher, getPersonalData);

router.put(
  "/profile",
  verifyTeacher,
  cloudinaryFileUploader.single("profileImage"),
  updateUserProfile
);

//
router.get("/getCourse", verifyTeacher, getMyCourses);

router.get("/getClassesByInstructor", verifyTeacher, getClassesByInstructor);

router.post("/save", saveAttendance);

router.delete(
  "/class/:classId/material/:materialId",
  verifyTeacher,
  deleteMaterial
);

router.get("/class/:id", verifyTeacher, getClassesById);
router.get("/notifications", verifyTeacher, getNotifications);
router.put("/:id/read", verifyTeacher, markAsRead);
router.put("/mark-all-read", verifyTeacher, markAllAsRead);
router.delete("/notifications/:id", deleteNotification);
export default router;

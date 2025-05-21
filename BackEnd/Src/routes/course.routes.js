import express from "express";

import {
  createCourse,
  getAllCourse,
  getCourseById,
  deleteCourseById,
  updateCourseById,
  registerCourse,
  registrations,
  getAllCourseForPublicRoute,
} from "../controller/course.controller.js";
import { cloudinaryFileUploader } from "../middleware/FileUploader.js";
import { get } from "mongoose";

const router = express.Router();

router.get("/getAllCourse", getAllCourse);

router.get("/getAllCourseForPublicRoute", getAllCourseForPublicRoute);

router.post("/", cloudinaryFileUploader.single("thumbnail"), createCourse);

router.get("/getCourse/:id", getCourseById);

router.delete("/:id", deleteCourseById);

router.put(
  "/:id",
  cloudinaryFileUploader.single("thumbnail"),
  updateCourseById
);

router.post("/register", registerCourse);

router.get("/registrations", registrations);

export default router;

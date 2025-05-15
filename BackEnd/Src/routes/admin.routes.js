import express from "express";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import {
  getDataAdmin,
  getDataUsers,
  createNewUser,
  updateUser,
  deleteUser,
  getInstructors,
  createEmployeeAccount,
  createParentAccount,
  createStudentAccount,
  getUser,
  checkParent,
} from "../controller/admin.controller.js";

import {
  createCourse,
  getAllCourse,
  getCourseById,
  deleteCourseById,
  updateCourseById,
  registrations,
  getRegistration,
  registerEnrollStudent,
  removeEnrollStudent,
  changeCourseEnrollStudent,
} from "../controller/course.controller.js";

import {
  createBanner,
  getBanner,
  updateBanner,
  deleteBanner,
  getBannerById,
} from "../controller/banner.controller.js";

import {createClass, getClasses, updateClass, deleteClass} from "../controller/class.controller.js"

import { cloudinaryFileUploader } from "../middleware/FileUploader.js";

const router = express.Router();

router.get("/dashboard", verifyAdmin, getDataAdmin);

// User, employee, parent, student account
router.get("/getDataUsers", verifyAdmin, getDataUsers);

router.post("/createNewUser", verifyAdmin, createNewUser);

router.put("/updateUser/:id", verifyAdmin, updateUser);

router.delete("/deleteUser/:id", verifyAdmin, deleteUser);

router.post("/createEmployee", verifyAdmin, createEmployeeAccount);

router.post("/createParentAccount", verifyAdmin, createParentAccount);

router.post("/createStudentAccount", verifyAdmin, createStudentAccount);

router.get("/getUser/:id", verifyAdmin, getUser);

router.get("/checkParent/:phoneNumber", verifyAdmin, checkParent);

// Course

router.get("/getCourse", verifyAdmin, getAllCourse);

router.post(
  "/createCourse",
  verifyAdmin,
  cloudinaryFileUploader.single("thumbnail"),
  createCourse
);

router.get("/getCourseById/:id", getCourseById);

router.delete("/deleteCourse/:id", verifyAdmin, deleteCourseById);

router.put(
  "/updateCourse/:id",
  verifyAdmin,
  cloudinaryFileUploader.single("thumbnail"),
  updateCourseById
);

router.post("/registerEnrollStudent/:id", verifyAdmin, registerEnrollStudent);

router.put("/changeCourseEnrollStudent/:id", verifyAdmin, changeCourseEnrollStudent)

router.delete("/:idCourse/removeEnrollStudent/:userId", verifyAdmin, removeEnrollStudent);

// get Instructors

router.get("/getInstructors", verifyAdmin, getInstructors);

// get registrations for register course
router.get("/registrations", verifyAdmin, registrations);

router.get("/registrations/:id", verifyAdmin, getRegistration);

// Banner of courses
router.post(
  "/createBanner",
  verifyAdmin,
  cloudinaryFileUploader.single("backgroundImage"),
  createBanner
);

router.get("/getBanner", verifyAdmin, getBanner);

router.get("/getBannerById/:id", verifyAdmin, getBannerById);

router.put("/updateBanner/:id", verifyAdmin, cloudinaryFileUploader.single("backgroundImage") ,updateBanner);

router.delete("/deleteBanner/:id", verifyAdmin, deleteBanner);

// Class Management

router.post("/createClass", verifyAdmin, createClass)

router.get("/getClasses", verifyAdmin, getClasses);

router.put("/updateClass/:id", verifyAdmin, updateClass)

router.delete("/deleteClass/id", verifyAdmin, deleteClass)

export default router;

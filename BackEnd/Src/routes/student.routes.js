import express from "express";

import { verifyStudent } from "../middleware/verifyStudent.js";
import { getDataStudent } from "../controller/student.controller.js";
import { getClassByIdStudent } from "../controller/class.controller.js";
import {getPersonalData, updateUserProfile, updatePassword} from "../controller/auth.controller.js"
import { cloudinaryFileUploader } from "../middleware/FileUploader.js";

const router = express.Router();

router.get("/dashboard", verifyStudent, getDataStudent);

router.get("/getClassByIdStudent", verifyStudent, getClassByIdStudent);

// Profile
router.get("/profile", verifyStudent ,getPersonalData);

router.put("/profile", verifyStudent, cloudinaryFileUploader.single("profileImage"), updateUserProfile)

// Update password
router.patch("/update-password", verifyStudent, updatePassword);

export default router;

import express from "express";

import { verifyStudent } from "../middleware/verifyStudent.js";
import { getDataStudent } from "../controller/student.controller.js";
import { getClassByIdStudent } from "../controller/class.controller.js";

const router = express.Router();

router.get("/dashboard", verifyStudent, getDataStudent);

router.get("/getClassByIdStudent", verifyStudent, getClassByIdStudent);

export default router;

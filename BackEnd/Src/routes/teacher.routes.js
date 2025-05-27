import express, { Router } from 'express'


import {getMyCourses, saveAttendance} from '../controller/teacher.controller.js'
import {getClassesByInstructor} from '../controller/class.controller.js'
import { verifyTeacher } from '../middleware/verifyTeacher.js';
import { deleteMaterial } from '../controller/class.controller.js';
const router = express.Router();




router.get('/getCourse',verifyTeacher, getMyCourses);

router.get('/getClassesByInstructor', verifyTeacher, getClassesByInstructor)

router.post('/save', saveAttendance)

router.delete(
  "/class/:classId/material/:materialId",
  verifyTeacher,
  deleteMaterial
);

export default router;
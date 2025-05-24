import express, { Router } from 'express'


import {getMyCourses, saveAttendance} from '../controller/teacher.controller.js'
import {getClassesByInstructor} from '../controller/class.controller.js'
import { verifyTeacher } from '../middleware/verifyTeacher.js';

const router = express.Router();




router.get('/getCourse',verifyTeacher, getMyCourses);

router.get('/getClassesByInstructor', verifyTeacher, getClassesByInstructor)

router.post('/save', saveAttendance)


export default router;
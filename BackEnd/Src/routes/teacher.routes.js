import express, { Router } from 'express'


import {getMyCourses} from '../controller/teacher.controller.js'
import { verifyTeacher } from '../middleware/verifyTeacher.js';

const router = express.Router();




router.get('/getCourse',verifyTeacher, getMyCourses);




export default router;
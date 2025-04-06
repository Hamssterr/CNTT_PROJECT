import express from 'express';

import { verifyStudent } from '../middleware/verifyStudent.js';
import {getDataStudent} from '../controller/student.controller.js'

const router = express.Router();

router.get('/dashboard', verifyStudent, getDataStudent)

export default router;
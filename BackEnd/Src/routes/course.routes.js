import express from 'express'

import { createCourse, getAllCourse, getCourseById, deleteCourseById, updateCourseById } from '../controller/course.controller.js'
import  {cloudinaryFileUploader}  from '../middleware/FileUploader.js';

const router = express.Router();

router.get('/', getAllCourse);

router.post('/', cloudinaryFileUploader.single('courseImage'), createCourse);

router.get('/:id', getCourseById);

router.delete('/:id', deleteCourseById);

router.put('/:id', cloudinaryFileUploader.single('courseImage'), updateCourseById);

export default router;

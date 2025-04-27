import express from 'express'
import { verifyAdmin } from '../middleware/verifyAdmin.js';
import { getDataAdmin, getDataUsers, createNewUser, updateUser, deleteUser, getInstructors, 
    createEmployeeAccount, createParentAccount, createStudentAccount } from '../controller/admin.controller.js';

import { createCourse, getAllCourse, getCourseById, deleteCourseById, updateCourseById } from '../controller/course.controller.js'
import  {cloudinaryFileUploader}  from '../middleware/FileUploader.js';

const router = express.Router();

router.get("/dashboard", verifyAdmin, getDataAdmin);

router.get("/getDataUsers", verifyAdmin, getDataUsers);

router.post("/createNewUser", verifyAdmin, createNewUser);

router.put("/updateUser/:id", verifyAdmin, updateUser);

router.delete("/deleteUser/:id", verifyAdmin, deleteUser);

router.post("/createEmployee", verifyAdmin, createEmployeeAccount)

router.post("/createParentAccount", verifyAdmin, createParentAccount);

router.post("/createStudentAccount", verifyAdmin, createStudentAccount);

// Course

router.get('/getCourse', verifyAdmin,getAllCourse);

router.post('/createCourse', verifyAdmin, cloudinaryFileUploader.single('thumbnail'), createCourse);

router.get('/getCourseById/:id', getCourseById);

router.delete('/deleteCourse/:id', verifyAdmin, deleteCourseById);

router.put('/updateCourse/:id', verifyAdmin, cloudinaryFileUploader.single('thumbnail'), updateCourseById);


// get Instructors 

router.get('/getInstructors', verifyAdmin, getInstructors);


export default router;
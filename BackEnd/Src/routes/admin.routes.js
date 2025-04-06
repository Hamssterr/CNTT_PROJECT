import express from 'express'
import { verifyAdmin } from '../middleware/verifyAdmin.js';
import { getDataAdmin, getDataUsers, createNewUser } from '../controller/admin.controller.js';

const router = express.Router();

router.get("/dashboard", verifyAdmin, getDataAdmin);

router.get("/getDataUsers", verifyAdmin, getDataUsers);

router.post("/createNewUser", verifyAdmin, createNewUser);

export default router;
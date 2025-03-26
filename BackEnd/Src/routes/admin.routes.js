import express from 'express'
import { verifyAdmin } from '../middleware/verifyAdmin.js';
import { getDataAdmin } from '../controller/auth.admin.js';

const router = express.Router();

router.get("/dashboard", verifyAdmin, getDataAdmin);

export default router;
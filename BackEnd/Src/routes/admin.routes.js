import express from 'express'
import { verifyAdmin } from '../middleware/verifyAdmin.js';
import { getDataAdmin, getDataUsers, createNewUser, updateUser, deleteUser } from '../controller/admin.controller.js';

const router = express.Router();

router.get("/dashboard", verifyAdmin, getDataAdmin);

router.get("/getDataUsers", verifyAdmin, getDataUsers);

router.post("/createNewUser", verifyAdmin, createNewUser);

router.put("/updateUser/:id", verifyAdmin, updateUser);

router.delete("/deleteUser/:id", verifyAdmin, deleteUser);

export default router;
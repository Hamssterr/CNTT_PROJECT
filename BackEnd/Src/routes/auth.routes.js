import express from 'express'

import { signup, login, logout, verifyToken, checkAuth} from '../controller/auth.controller.js';
import {authenticateToken} from '../middleware/auth.middleware.js'

const router = express.Router();

router.post('/signup', signup);
router.post("/login", login);
router.post('/logout', logout);

router.get("/verify", verifyToken);

router.get('/check',authenticateToken,  checkAuth)

export default router;
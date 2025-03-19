import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/dashboard', authenticateToken(['student']), (req, res) => {
  res.json({ success: true, message: "Welcome to the student dashboard", user: req.user });
});

export default router;
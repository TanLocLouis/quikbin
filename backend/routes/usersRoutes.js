import express from 'express';
const router = express.Router();

import usersController from '../controllers/usersController.js';

// GET /api/users/profile
router.get('/profile/:id', usersController.getUserProfile);

export default router;
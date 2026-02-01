import express from 'express';
const router = express.Router();

import authController from '../controllers/authController.js';

// POST /api/auth/sign-up
router.post('/sign-up',
    authController.signUp
);

// POST /api/auth/verify-account
router.get('/verify-account',
    authController.verifyAccount
);

// POST /api/auth/login
router.post('/login',
    authController.login
);

export default router;


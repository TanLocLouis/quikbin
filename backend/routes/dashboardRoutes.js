import express from 'express';
const router = express.Router();

import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import ROLES from '../utils/role.js';

import dashboardController from '../controllers/dashboardController.js';

// GET /api/dashboard/statistics
router.get('/statistics', authenticate, authorize(ROLES.ADMIN), dashboardController.getStatistics);

// GET /api/dashboard/users
router.get('/users', authenticate, authorize(ROLES.ADMIN), dashboardController.getUsersList);

// GET /api/dashboard/bins?limit=10&offset=0&sortby=createdAt&order=desc&isShorternURL=true
router.get('/bins', authenticate, authorize(ROLES.ADMIN), dashboardController.getBinsList);

// PATCH /api/dashboard/users/:id/active
router.patch('/users/:id/active', authenticate, authorize(ROLES.ADMIN), dashboardController.setUserActive);

// PATCH /api/dashboard/bins/:id/deleted
router.patch('/bins/:id/deleted', authenticate, authorize(ROLES.ADMIN), dashboardController.setBinDeleted);

export default router;
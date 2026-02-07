import express from 'express';
const router = express.Router();

import binController from '../controllers/binController.js';
import { authenticate } from '../middleware/authenticate.js';

// POST /api/bin/create
router.post('/create',
    binController.createBin
)

// POST /api/bin/create/authenticated
router.post('/create/authenticated',
    authenticate,
    binController.createBin
);

// GET /api/bin/all
router.get('/all',
    authenticate,
    binController.getAllBins
);

// GET /api/bin/is-locked/:id
router.get('/is-locked/:id',
    binController.isLocked
);

// GET /api/bin/no-password/:id
router.get('/no-password/:id',
    binController.getBinWithoutPassword
);

// POST /api/bin/with-password/:id
router.post('/with-password/:id',
    binController.getBinWithPassword
);

export default router;
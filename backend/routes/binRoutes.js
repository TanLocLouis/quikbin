import express from 'express';
const router = express.Router();

import binController from '../controllers/binController.js';

// POST /api/bin/create
router.post('/create',
    binController.createBin
)

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
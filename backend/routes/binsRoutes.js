import express from 'express';
const router = express.Router();

import binsController from '../controllers/binsController.js';
import { authenticate } from '../middleware/authenticate.js';

// DELETE /api/bins/:id
router.delete('/:id',
    binsController.deleteBinWithId
);

// POST /api/bins/create
router.post('/create',
    binsController.createBin
);

// POST /api/bins/create/authenticated
router.post('/create/authenticated',
    authenticate,
    binsController.createBin
);

// GET /api/bins
router.get('/',
    authenticate,
    binsController.getAllBins
);

// GET /api/bins/is-locked/:id
router.get('/is-locked/:id',
    binsController.isLocked
);

// GET /api/bins/no-password/:id
router.get('/no-password/:id',
    binsController.getBinWithoutPassword
);

// POST /api/bins/with-password/:id
router.post('/with-password/:id',
    binsController.getBinWithPassword
);

export default router;
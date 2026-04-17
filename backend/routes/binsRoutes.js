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

// POST /api/bins/:id
router.post('/:id',
    binsController.getBinById
);

// PATCH /api/bins/:id
router.patch('/:id',
    binsController.updateBinPassword
);

export default router;
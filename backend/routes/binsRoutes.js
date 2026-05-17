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

// PATCH /api/bins/:id/password
router.patch('/:id/password',
    binsController.togglePassword
);

// PATCH /api/bins/:id/shorten-url
router.patch('/:id/shorten-url',
    binsController.toggleShortenURL
);

export default router;
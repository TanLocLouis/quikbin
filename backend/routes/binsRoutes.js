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

// GET /api/bins?limit=10&page=1&sortby=createdAt&order=desc&isShorternURL=true&search=searchTerm
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
    authenticate,
    binsController.updateBinPassword
);

// PATCH /api/bins/:id/password
router.patch('/:id/password',
    authenticate,
    binsController.togglePassword
);

// PATCH /api/bins/:id/shorten-url
router.patch('/:id/shorten-url',
    authenticate,
    binsController.toggleShortenURL
);

// GET /api/bins/search?query=searchTerm
router.get('/search',
    authenticate,
    binsController.searchBins
);

export default router;
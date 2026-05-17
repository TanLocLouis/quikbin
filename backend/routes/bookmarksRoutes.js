import express from 'express';
const router = express.Router();

import bookmarksController from '../controllers/bookmarksController.js';
import { authenticate } from '../middleware/authenticate.js';

// GET /api/bookmarks
router.get('/',
    authenticate,
    bookmarksController.getBookmarks
);

// POST /api/bookmarks/:id
router.post('/:id',
    authenticate,
    bookmarksController.createBookmark
);

// DELETE /api/bookmarks/:id
router.delete('/:id',
    authenticate,
    bookmarksController.deleteBookmark
);

export default router;

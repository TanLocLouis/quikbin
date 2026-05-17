import bookmarksService from '../services/bookmarksService.js';

const createBookmark = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const binId = req.params.id;
    if (!binId) {
        return res.status(400).json({ message: 'Bin ID is required' });
    }

    try {
        await bookmarksService.createBookmark(req.user.username, binId);
        return res.status(201).json({ message: 'Bookmark created' });
    } catch (err) {
        console.error('[ERROR] Failed to create bookmark', err);
        res.status(500).json({ message: 'Failed to create bookmark' });
    }
}

const deleteBookmark = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const binId = req.params.id;
    if (!binId) {
        return res.status(400).json({ message: 'Bin ID is required' });
    }

    try {
        const result = await bookmarksService.deleteBookmark(req.user.username, binId);
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Bookmark not found' });
        }
        return res.status(200).json({ message: 'Bookmark deleted' });
    } catch (err) {
        console.error('[ERROR] Failed to delete bookmark', err);
        res.status(500).json({ message: 'Failed to delete bookmark' });
    }
}

const getBookmarks = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const bookmarks = await bookmarksService.getBookmarksByUser(req.user.username);
        return res.status(200).json({ data: bookmarks });
    } catch (err) {
        console.error('[ERROR] Failed to retrieve bookmarks', err);
        res.status(500).json({ message: 'Failed to retrieve bookmarks' });
    }
}

export default {
    createBookmark,
    deleteBookmark,
    getBookmarks,
};

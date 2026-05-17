import bookmarksModel from '../models/bookmarksModel.js';

async function createBookmark(userId, binId) {
    const result = await bookmarksModel.createBookmark(userId, binId);
    return result;
}

async function deleteBookmark(userId, binId) {
    const result = await bookmarksModel.deleteBookmark(userId, binId);
    return result;
}

async function getBookmarksByUser(userId) {
    const bookmarks = await bookmarksModel.getBookmarksByUserId(userId);
    return bookmarks;
}

export default {
    createBookmark,
    deleteBookmark,
    getBookmarksByUser,
};

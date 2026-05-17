import client from '../db/db.js';

const db = client.db('quikbin');
const bookmarksCollection = db.collection('bookmarks');

const bookmarksModel = {
    async createBookmark(userId, binId) {
        const result = await bookmarksCollection.updateOne(
            { userId: userId, bin_id: binId },
            { $setOnInsert: { userId: userId, bin_id: binId, createdAt: new Date() } },
            { upsert: true }
        );
        return result;
    },
    async deleteBookmark(userId, binId) {
        const result = await bookmarksCollection.deleteOne({ userId: userId, bin_id: binId });
        return result;
    },
    async getBookmarksByUserId(userId) {
        const bookmarks = await bookmarksCollection.find({ userId: userId }).toArray();
        return bookmarks;
    },
};

export default bookmarksModel;

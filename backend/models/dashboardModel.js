import client from '../db/db.js';

const db = client.db('quikbin');

const dashboardModel = {
    async getStatistics() {
        const totalBins = await db.collection('bins').countDocuments();
        const totalUsers = await db.collection('users').countDocuments();

        return {
            totalBins,
            totalUsers,
            totalBookmarks
        };
    },
    async getUsersList(limit, offset) {
        const users = await db.collection('users').find({}, { projection: { passwordHash: 0 } }).skip(offset).limit(limit).toArray();
        return users;
    },
    async getBinsList(limit, offset, sortBy, sortOrder, isShorternURL) {
        // console.log(`[DEBUG] getBinsList - limit: ${limit}, offset: ${offset}, sortBy: ${sortBy}, sortOrder: ${sortOrder}, isShorternURL: ${isShorternURL}`);
        let query = {};
        if (isShorternURL === "true") {
            // console.log("[DEBUG] isShorternURL:", isShorternURL);
            query = { isShorternURL: true }
        } else if (isShorternURL === "false") {
            query = { isShorternURL: false }
        }
        const bins = await db.collection('bins').find(query).skip(offset).limit(limit).sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 }).toArray();
        return bins;
    },
    async setUserActive(userId, isActive) {
        const result = await db.collection('users').updateOne({ userId: userId }, { $set: { isActive: isActive } });
        return result;
    },
    async setBinDeleted(binId, isDeleted) {
        const result = await db.collection('bins').updateOne({ bin_id: binId }, { $set: { isDeleted: isDeleted } });
        // console.log("[DEBUG] dashboardModel - setBinDeleted result:", result, binId, isDeleted);
        return result;
    }
}

export default dashboardModel;
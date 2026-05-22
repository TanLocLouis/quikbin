import client from '../db/db.js';

const db = client.db('quikbin');
const binsCollection = db.collection('bins');

const binsModel = {
    async createBin(binData) {
        const result = await binsCollection.insertOne(
            {
                bin_id: binData.id,
                text: binData.text,
                password: binData.password,
                expireTime: binData.expireTime,
                isShorternURL: binData.isShorternURL,
                createdAt: new Date(Date.now()),
                closeBinAt: new Date(Date.now() + 1000 * binData.expireTime),
                isDeleted: false,

                userId: binData.userId || null,
            }
        );
        return result;
    },
    async isBinExisted(binId) {
        const bin = await binsCollection.findOne({ bin_id: binId });
        return bin !== null;
    },
    async getAllBinsByUserId(userId, limit, offset, sortBy, sortOrder, isShorternURL, searchQuery) {

        // console.log(`[DEBUG] getAllBins - userId: ${userId}, limit: ${limit}, offset: ${offset}, sortBy: ${sortBy}, sortOrder: ${sortOrder}, isShorternURL: ${isShorternURL}, searchQuery: ${searchQuery}`);
        // Fetch all bins
        // if isShorternURL is not choosen
        let query = { userId: userId };
        if (isShorternURL === "true") {
            // console.log("[DEBUG] isShorternURL:", isShorternURL);
            query = { userId: userId, isShorternURL: true }
        } else if (isShorternURL === "false") {
            query = { userId: userId, isShorternURL: false }
        }

        if (searchQuery) {
            query = { ...query, text: { $regex: searchQuery, $options: 'i' } };
        }

        // console.log("[DEBUG] query:", query);
        const bins = await binsCollection.find(query)
                                         .sort({ [sortBy]: sortOrder })
                                         .limit(limit)
                                         .skip(offset)
                                         .toArray();

        return bins;
    },
    async countAllBinsByUserId(userId, searchQuery) {
        let query = { userId: userId };
        if (searchQuery) {
            query = { ...query, text: { $regex: searchQuery, $options: 'i' } };
        }
        const count = await binsCollection.countDocuments(query);
        return count;
    },
    async getBinById(binId) {
        const bin = await binsCollection.findOne({ bin_id: binId });
        return bin;
    },
    async isBinLocked(binId) {
        const bin = await binsCollection.findOne({ bin_id: binId });
        if (bin && bin.password && bin.password !== '') {
            return true;
        }

        return false;
    },
    async deleteBinById(binId) {
        const result = await binsCollection.deleteOne({ bin_id: binId });
        return result;
    },
    async updateBinPassword(binId, newHashedPassword) {
        const result = await binsCollection.updateOne(
            { bin_id: binId },
            { $set: { password: newHashedPassword } }
        );
        return result;
    },
    async updateBinShortenURL(binId, isShorternURL) {
        const result = await binsCollection.updateOne(
            { bin_id: binId },
            { $set: { isShorternURL: isShorternURL } }
        );
        return result;
    },
    async searchBinsByUserId(userId, query) {
        const bins = await binsCollection.find(
            { $and: [
                { userId: { $regex: userId, $options: 'i' } },
                { text: { $regex: query, $options: 'i' } }
            ] }
        ).toArray();

        return bins;
    }
};

export default binsModel;
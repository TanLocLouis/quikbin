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

                userId: binData.userId || null,
            }
        );
        return result;
    },
    async isBinExisted(binId) {
        const bin = await binsCollection.findOne({ bin_id: binId });
        return bin !== null;
    },
    async getAllBinsByUserId(userId, limit, offset, sortBy, sortOrder) {
        const bins = await binsCollection.find({ userId: userId })
                                         .sort({ [sortBy]: sortOrder })
                                         .limit(limit)
                                         .skip(offset)
                                         .toArray();

        return bins;
    },
    async countAllBinsByUserId(userId) {
        const count = await binsCollection.countDocuments({ userId: userId });
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
    }
};

export default binsModel;
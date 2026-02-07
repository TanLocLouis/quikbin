import client from '../db/db.js';

const db = client.db('quikbin');
const binsCollection = db.collection('bins');

const binModel = {
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
    async getAllBinsByUserId(userId) {
        const bins = await binsCollection.find({ userId: userId }).toArray();
        return bins;
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
};

export default binModel;
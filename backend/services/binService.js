import binModel from '../models/binModel.js';
import passwordUtil from '../utils/password.js';

async function createBin(binData) {
    const bin = {
        id: binData.id,
        text: binData.text,
        password: binData.password || '',
        expireTime: binData.expireTime,
        isShorternURL: binData.isShorternURL,

        userId: binData.userId || null,
    };

    // Check if bin ID exists
    const id = bin.id;
    const exists = await binModel.isBinExisted(id);

    if (exists) {
        const err = new Error('Bin ID already exists');
        err.code = 'BIN_ID_EXISTS';
        throw err;
    }

    // Check if user has set password
    // If yes, hash it
    if (bin['password'] !== '') {
        bin['password'] = await passwordUtil.hashPassword(bin['password']);
    // Or they not use password, just insert to bins
    }

    const result = await binModel.createBin(bin);
    return result;
}

async function isLocked(binId) {
    const locked = await binModel.isBinLocked(binId);
    return locked;
}

async function getAllBinsByUser(userId, limit, offset) {
    const bins = await binModel.getAllBinsByUserId(userId, limit, offset);
    return bins;
}

async function countAllBinsByUser(userId) {
    const countBins = await binModel.countAllBinsByUserId(userId);
    return countBins; 
}

async function getBinWithoutPassword(binId) {
    const bin = await binModel.getBinById(binId);
    return bin;
}

async function getBinWithPassword(binId, password) {
    const bin = await binModel.getBinById(binId);

    // If not found
    if (!bin) {
        return null;
    }

    // Compare password
    const isMatch = await passwordUtil.comparePassword(password, bin['password']);
    if (!isMatch) {
        return null;
    }

    return bin;
}

async function deleteBinWithId(binId) {
    const result = await binModel.deleteBinById(binId);
    return result;
}

export default {
    createBin,
    isLocked,
    getAllBinsByUser,
    countAllBinsByUser,
    getBinWithoutPassword,
    getBinWithPassword,
    deleteBinWithId,
}
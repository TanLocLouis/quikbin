import binsModel from '../models/binsModel.js';
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
    const exists = await binsModel.isBinExisted(id);

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

    const result = await binsModel.createBin(bin);
    return result;
}

async function isLocked(binId) {
    const locked = await binsModel.isBinLocked(binId);
    return locked;
}

async function getAllBinsByUser(userId, limit, offset, sortBy, sortOrder) {
    const bins = await binsModel.getAllBinsByUserId(userId, limit, offset, sortBy, sortOrder);
    return bins;
}

async function countAllBinsByUser(userId) {
    const countBins = await binsModel.countAllBinsByUserId(userId);
    return countBins; 
}

async function getBinById(binId, password) {
    const bin = await binsModel.getBinById(binId);

    if (!bin) {
        return null;
    }

    // Check if bin using password
    if (bin.password) {
        if (!password) {
            return null;
        }

        const isMatch = await passwordUtil.comparePassword(password, bin.password);
        if (!isMatch) {
            return null;
        }
    }

    return bin;
}

async function getBinWithoutPassword(binId) {
    const bin = await binsModel.getBinById(binId);
    return bin;
}

async function getBinWithPassword(binId, password) {
    const bin = await binsModel.getBinById(binId);

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
    const result = await binsModel.deleteBinById(binId);
    return result;
}

async function updateBinPassword(binId, newPassword) {
    // Hash new password
    const hashedPassword = await passwordUtil.hashPassword(newPassword);

    // Update bin with new hashed password
    const result = await binsModel.updateBinPassword(binId, hashedPassword);
    return result;
}

export default {
    createBin,
    isLocked,
    getAllBinsByUser,
    countAllBinsByUser,
    getBinById,
    deleteBinWithId,
    updateBinPassword,
}
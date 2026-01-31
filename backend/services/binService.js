import binModel from '../models/binModel.js';
import { hashPassword, comparePassword } from '../utils/password.js';

async function createBin(binData) {
    const bin = {
        id: binData.id,
        text: binData.text,
        password: binData.password || '',
        expireTime: binData.expireTime,
        isShorternURL: binData.isShorternURL,
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
        bin['password'] = await hashPassword(bin['password']);
    // Or they not use password, just insert to bins
    }

    const result = await binModel.createBin(bin);
    return result;
}

async function isLocked(binId) {
    const locked = await binModel.isBinLocked(binId);
    return locked;
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
    const isMatch = await comparePassword(password, bin['password']);
    if (!isMatch) {
        return null;
    }

    return bin;
}

export default {
    createBin,
    isLocked,
    getBinWithoutPassword,
    getBinWithPassword
}
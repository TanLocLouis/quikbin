
import binService from '../services/binService.js';

const createBin = async (req, res) => {
    try {
        // If authenticated user, set userId
        // If not, userId will be guest (null)
        if (req.user) {
            req.body.data.userId = req.user.username;
        }

        const insertedBin = await binService.createBin(req.body.data);
        res.status(201).json({ message: 'Bin created', id: insertedBin.insertedId });
    } catch (err) {
        if (err.code === 'BIN_ID_EXISTS') {
            res.status(400).json({ message: 'Bin ID already exists' });
        } else {
            console.error('[ERROR] Failed to create bin', err);
            res.status(500).json({ message: 'Failed to create bin' });
        }
    }
}


const isLocked = async (req, res) => {
    const id = req.params.id;

    try {
        const isLocked = await binService.isLocked(id);
        res.status(200).json({ isLocked: isLocked });
    } catch (err) {
        console.error('[ERROR] Failed to check if bin is locked', err);
        res.status(500).json({ message: 'Failed to check if bin is locked' });
    }
}

const getBinWithoutPassword = async (req, res) => {
    const id = req.params.id;
    console.log("[DEBUG] fetching bin without password:", id);

    try {
        const bin = await binService.getBinWithoutPassword(id);
        if (!bin) {
            console.log('[STATUS] Bin not found', id);
            return res.status(404).json({ message: 'Bin not found' });
        }

        if (bin['password'] === '') {
            console.log('[STATUS] Bin retrieved', bin);
            return res.status(200).json(bin);
        } else {
            console.log('[STATUS] Bin retrieved, password required');
            return res.status(401).json({ message: 'Password required' });
        }
    } catch (err) {
        console.error('[ERROR] Failed to retrieve bin', err);
        res.status(500).json({ message: 'Failed to retrieve bin' });
    }
}

const getBinWithPassword = async (req, res) => {
    const password = req.body.password;
    console.log("[DEBUG] Password received:", password);

    const id = req.params.id;

    try {
        const bin = await binService.getBinWithPassword(id, password);
        if (!bin) {
            console.log('[STATUS] Bin not found', id);
            return res.status(404).json({ message: 'Bin not found' });
        }

        return res.status(200).json(bin);
    } catch (err) {
        console.error('[ERROR] Failed to retrieve bin with password', err);
        res.status(500).json({ message: 'Failed to retrieve bin with password' });
    }
}

export default {
    createBin,
    isLocked,
    getBinWithoutPassword,
    getBinWithPassword
};
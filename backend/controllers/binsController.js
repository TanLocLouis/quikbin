
import binsService from '../services/binsService.js';

const createBin = async (req, res) => {
    try {
        // If authenticated user, set userId
        // If not, userId will be guest (null)
        if (req.user) {
            req.body.data.userId = req.user.username;
        }

        const insertedBin = await binsService.createBin(req.body.data);
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
    if (!req.params.id) {
        return res.status(400).json({ message: 'Bin ID is required' });
    }

    const id = req.params.id;

    try {
        const isLocked = await binsService.isLocked(id);
        res.status(200).json({ isLocked: isLocked });
    } catch (err) {
        console.error('[ERROR] Failed to check if bin is locked', err);
        res.status(500).json({ message: 'Failed to check if bin is locked' });
    }
}

const getAllBins = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get query params for pagination and sorting
    const userId = req.user.username;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const offset = parseInt(req.query.offset) || 0;
    const sortBy = req.query.sortby || 'createdAt';
    const sortOrder = req.query.order || 'desc';

    // Validate sortBy and sortOrder
    if (!['isShorternURL', 'createdAt', 'closeBinAt'].includes(sortBy)) {
        return res.status(400).json({ message: 'Invalid sortBy parameter' });
    }
    if (!['asc', 'desc'].includes(sortOrder)) {
        return res.status(400).json({ message: 'Invalid sortOrder parameter' });
    }

    try {
        const bins = await binsService.getAllBinsByUser(userId, limit, offset, sortBy, sortOrder);
        const totalBins = await binsService.countAllBinsByUser(userId);
        res.status(200).json( {
            data: bins,
            pagination: {
                limit: limit,
                offset: offset,
                totalBins: totalBins
            }
        });
    } catch (err) {
        console.error('[ERROR] Failed to retrieve all bins for user: ', userId, err);
        res.status(500).json({ message: 'Failed to retrieve bins' });
    }
}

const getBinById = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ message: 'Bin ID is required' });
    }

    const id = req.params.id;

    let password = "";
    if (req.body) {
        password = req.body.password;
    }

    try {
        const bin = await binsService.getBinById(id, password);

        if (!bin) {
            // console.log('[STATUS] Bin not found', id);
            return res.status(404).json({ message: 'Bin not found' });
        }

        return res.status(200).json(bin);
    } catch (err) {
        console.error('[ERROR] Failed to retrieve bin', err);
        res.status(500).json({ message: 'Failed to retrieve bin' });
    }
}

const deleteBinWithId = async (req, res) => {
    const id = req.params.id;

    try {
       const result = await binsService.deleteBinWithId(id);
       if (result.deletedCount === 1) {
           return res.status(200).json({ message: 'Bin deleted successfully' });
       } else {
           return res.status(404).json({ message: 'Bin not found' });
       } 
    } catch (err) {
        console.error('[ERROR] Failed to delete bin', err);
        res.status(500).json({ message: 'Failed to delete bin' });
    }
}

const updateBinPassword = async (req, res) => {
    const id = req.params.id;
    const { password } = req.body;

    try {
        const result = await binsService.updateBinPassword(id, password);
        if (result.modifiedCount === 1) {
            return res.status(200).json({ message: 'Bin password updated successfully' });
        } else {
            return res.status(404).json({ message: 'Bin not found' });
        }
    } catch (err) {
        console.error('[ERROR] Failed to update bin password', err);
        res.status(500).json({ message: 'Failed to update bin password' });
    }
}

export default {
    createBin,
    isLocked,
    getAllBins,
    getBinById,
    deleteBinWithId,
    updateBinPassword,
};
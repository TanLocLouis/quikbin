import dashboardService from '../services/dashboardService.js';

const getStatistics = async (req, res) => {
    const userId = req.user.username;
    try {
        const stats = await dashboardService.getStatistics();
        if (!stats) {
            return res.status(404).json({ 
                error: 'STATISTICS_NOT_FOUND',
                message: 'Statistics not found' 
            });
        }

        res.status(200).json({
            statistics: stats
        });
    } catch (err) {
        console.error('[ERROR] Failed to get statistics', err);
        res.status(500).json({ 
            error: 'GET_STATISTICS_FAILED',
            message: 'Failed to get statistics' 
        });
    }
}

const getUsersList = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    try {
        const usersList = await dashboardService.getUsersList(limit, offset);
        res.status(200).json({
            users: usersList
        });
    } catch (err) {
        console.error('[ERROR] Failed to get users list', err);
        res.status(500).json({ 
            error: 'GET_USERS_LIST_FAILED',
            message: 'Failed to get users list' 
        });
    }
}

const getBinsList = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const sortBy = req.query.sortby || 'createdAt';
    const sortOrder = req.query.order || 'desc';
    const isShorternURL = req.query.isShorternURL || 'all';

    if (!['createdAt', 'closeBinAt'].includes(sortBy)) {
        return res.status(400).json({ 
            error: 'INVALID_SORT_BY',
            message: 'Invalid sortBy parameter' 
        });
    }
    if (!['asc', 'desc'].includes(sortOrder)) {
        return res.status(400).json({ 
            error: 'INVALID_SORT_ORDER',
            message: 'Invalid sortOrder parameter' 
        });
    }
    if (!['all', 'true', 'false'].includes(isShorternURL)) {
        return res.status(400).json({ 
            error: 'INVALID_SORT_ORDER',
            message: 'Invalid sortOrder parameter' 
        });
    }

    try {
        const binsList = await dashboardService.getBinsList(limit, offset, sortBy, sortOrder, isShorternURL);
        res.status(200).json({
            bins: binsList
        });
    } catch (err) {
        console.error('[ERROR] Failed to get bins list', err);
        res.status(500).json({ 
            error: 'GET_BINS_LIST_FAILED',
            message: 'Failed to get bins list' 
        });
    }
}

const setUserActive = async (req, res) => {
    const username = req.params.userId;
    const isActive = req.body.isActive;

    if (!req.body) {
        return res.status(400).json({ 
            error: 'NO_DATA_PROVIDED',
            message: 'No data provided'
        });
    }

    try {
        await dashboardService.setUserActive(username, isActive);
        res.status(200).json({ 
            message: 'User activated successfully' 
        });
    } catch (err) {
        console.error('[ERROR] Failed to set user active', err);
        res.status(500).json({ 
            error: 'SET_USER_ACTIVE_FAILED',
            message: 'Failed to set user active' 
        });
    }
}

const setBinDeleted = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ 
            error: 'NO_DATA_PROVIDED',
            message: 'No data provided'
        });
    }

    const binId = req.params.id;
    const isDeleted = req.body.isDeleted;
    try {
        await dashboardService.setBinDeleted(binId, isDeleted);
        res.status(200).json({ 
            message: 'Bin deleted successfully' 
        });
    } catch (err) {
        console.error('[ERROR] Failed to set bin deleted', err);
        res.status(500).json({ 
            error: 'SET_BIN_DELETED_FAILED',
            message: 'Failed to set bin deleted' 
        });
    }
}

export default {
    getStatistics,
    getUsersList,
    getBinsList,
    setUserActive,
    setBinDeleted,
}
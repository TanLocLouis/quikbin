import usersService from '../services/usersService.js';

async function getUserProfile(req, res) {
    const userId = req.params.id;
    try {
        const userProfile = await usersService.getUserProfile(userId);
        res.status(200).json({
            user: userProfile
        });
    } catch (err) {
        console.error('[ERROR] Failed to get user profile', err);
        res.status(500).json({ 
            error: 'GET_USER_PROFILE_FAILED',
            message: 'Failed to get user profile' 
        });
    }
}

export default {
    getUserProfile
}
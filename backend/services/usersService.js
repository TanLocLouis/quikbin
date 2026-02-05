import usersModel from "../models/usersModel.js";

async function getUserProfile(userId) {
    try {
        return usersModel.getUserProfile(userId);
    } catch (err) {
        throw new Error('Failed to retrieve user profile');
    }
}

export default {
    getUserProfile
}
import dashboardModel from "../models/dashboardModel.js";

const getStatistics = async () => {
    try {
        const curDate = new Date();
        const curDay = curDate.getDate();
        const curMonth = curDate.getMonth() + 1;
        const curYear = curDate.getFullYear();
    } catch (err) {
    }
}

const getUsersList = async (limit, offset) => {
    try {
        const result = await dashboardModel.getUsersList(limit, offset);
        return result;
    } catch (err) {
        throw new Error('Failed to get users list');
    }
}

const getBinsList = async (limit, offset, sortBy, sortOrder, isShorternURL) => {
    try {
        const result = await dashboardModel.getBinsList(limit, offset, sortBy, sortOrder, isShorternURL);
        return result;
    } catch (err) {
        throw new Error('Failed to get bins list');
    }
}

async function setUserActive(userId, isActive) {
    try {
        const result = await dashboardModel.setUserActive(userId, isActive);
        return result;
    } catch (err) {
        throw new Error('Failed to update user active status');
    }
}

async function setBinDeleted(binId, isDeleted) {
    try {
        const result = await dashboardModel.setBinDeleted(binId, isDeleted);
        return result;
    } catch (err) {
        throw new Error('Failed to update bin deleted status');
    }
}

export default {
    getStatistics,
    getUsersList,
    getBinsList,
    setUserActive,
    setBinDeleted
}
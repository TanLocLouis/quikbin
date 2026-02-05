import client from '../db/db.js';

const db = client.db('quikbin');
const usersCollection = db.collection('users');

const usersModel = {
    async getUserProfile(userId) {
        const user = await usersCollection.findOne({ username: userId }, {
            projection: { passwordHash: 0 }
        });

        return user;
    }
}

export default usersModel;
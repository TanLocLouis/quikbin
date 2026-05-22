import client from '../db/db.js';
import { v4 as uuidv4 } from 'uuid';

const db = client.db('quikbin');
const usersCollection = db.collection('users');

const authModel = {
    async createUser(userData) {
        const user = {
            userId: uuidv4(),
            username: userData.username,
            email: userData.email,
            passwordHash: userData.passwordHash,
            role: 'USER',
            createdAt: new Date(Date.now()),
            isActive: false,
            isDeleted: false
        }

        const result = await usersCollection.insertOne(user);
        return result;
    },
    async deleteUser(userId) {
        const result = await usersCollection.deleteOne({ userId: userId });
        return result;
    },
    async isUserExisted(username) {
        const user = await usersCollection.findOne({ username: username });
        return user !== null;
    },
    async setActive(username) {
        const result = await usersCollection.updateOne(
            { username: username },
            { $set: { isActive: true } }
        );
        return result;
    },
    async getUserByUsername(username) {
        const user = await usersCollection.findOne({ username: username });
        return user;
    },
    async getUserByEmail(email) {
        const user = await usersCollection.findOne({ email: email });
        return user;
    },
    async updatePassword(username, newPasswordHash) {
        const result = await usersCollection.updateOne(
            { username: username },
            { $set: { passwordHash: newPasswordHash } }
        );
        return result;
    }
}

export default authModel;
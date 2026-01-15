const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

require('dotenv').config();
const { validateBin } = require('./middleware/validate');
const { hashPassword } = require('./utils/password');

const { MongoClient  } = require('mongodb');
// Connect to MongoDB
const uri = process.env.MONGO_DB_URL;
const client = new MongoClient(uri);
client.connect()
    .then(() => console.log('[STATUS] Connected to MongoDB'))
    .catch(err => console.error('[ERROR] Failed to connect to MongoDB', err));


// Create a new bin
app.post('/create', validateBin, async (req, res) => {
    const db = client.db('quikbin');
    const collection = db.collection('bins');
    const value = req.body.data;

    // console.log('[DEBUG] Creating bin with data:', value);

    const bin = {
        id: value.id,
        text: value.text,
        password: value.password || '',
        expireTime: value.expireTime,
        isShorternURL: value.isShorternURL,
    };

    // Check if pin ID is exists
    const id = bin.id;
    try {
        const bin = await collection.findOne({'id': id})
        if (bin) {
            console.log('[STATUS] Bin ID already exists', id);
            return res.status(400).json({ message: 'Bin ID already exists' });
        }
    } catch (err) {
        console.error('[ERROR] Failed to retrieve bin', err);
        return res.status(500).json({ message: 'Failed to retrieve bin' });
    }

    // Set createdAt and closeBinAt
    // createdAt is the time when the bin is created
    // closeBinAt is the time when the bin will be closed
    bin['createdAt'] = new Date(Date.now());
    bin['closeBinAt'] = new Date(Date.now() + 1000 * bin.expireTime);

    // Check if user has set password
    // If yes, hash it
    if (bin['password'] !== '') {
        hashPassword(bin['password'])
        .then(hashed => {
            bin['password'] = hashed;

            collection.insertOne(bin)
                .then(result => {
                    console.log('[STATUS] Bin created', result.insertedId);
                    res.status(201).json({ message: 'Bin created', id: result.insertedId });
                })
                .catch(err => {
                    console.error('[ERROR] Failed to create bin', err);
                    res.status(500).json({ message: 'Failed to create bin' });
                });
            }
        );
    // Or they not use password, just insert to bins
    } else {
            collection.insertOne(bin)
                .then(result => {
                    console.log('[STATUS] Bin created', result.insertedId);
                    res.status(201).json({ message: 'Bin created', id: result.insertedId });
                })
                .catch(err => {
                    console.error('[ERROR] Failed to create bin', err);
                    res.status(500).json({ message: 'Failed to create bin' });
                });

    }
});

// Check bins password without retrieving the bin
app.get('/is-locked/:id', (req, res) => {
    const db = client.db('quikbin');
    const collection = db.collection('bins');

    const id = req.params.id;

    collection.findOne({'id': id})
        .then(bin => {
            if (!bin) {
                console.log('[STATUS] Bin not found', id);
                return res.status(404).json({ message: 'Bin not found' });
            }

            if (bin['password'] !== '') {
                return res.status(200).json({ message: "locked" });
            } else {
                return res.status(200).json({ message: "no-password" });
            }
        });
});

// Get bins without password authentication
app.post('/:id/no-password', (req, res) => {
    const db = client.db('quikbin');
    const collection = db.collection('bins');

    const id = req.params.id;
    console.log("[DEBUG] fetching bin without password:", id);

    collection.findOne({'id': id})
        .then(bin => {
            if (!bin) {
                console.log('[STATUS] Bin not found', id);
                return res.status(404).json({ message: 'Bin not found' });
            }

            // if bin not used password
            // just return data
            if (bin['password'] === '') {
                console.log('[STATUS] Bin retrieved', bin);
                return res.status(200).json(bin);
            }
            else {
                console.log('[STATUS] Bin retrieved, password required');
                return res.status(401).json({ message: 'Password required' });
            }
        })
        .catch(err => {
            console.error('[ERROR] Failed to retrieve bin', err);
            res.status(500).json({ message: 'Failed to retrieve bin' });
        });
});

// Get bins with password authentication
app.post('/:id/lock', (req, res) => {
    console.log("[DEBUG] password authentication", req.body);
    const db = client.db('quikbin');
    const collection = db.collection('bins');
    const password = req.body.password;
    console.log("[DEBUG] Password received:", password);

    const id = req.params.id;

    collection.findOne({'id': id})
        .then(bin => {
            if (!bin) {
                console.log('[STATUS] Bin not found', id);
                return res.status(404).json({ message: 'Bin not found' });
            }

            // Bin requires password authentication
            const { comparePassword } = require('./utils/password');
            if (!req.body || !password) {
                console.log('[STATUS] Bin retrieved, password required');
                return res.status(401).json({ message: 'Password required' });
            }
            comparePassword(password, bin['password'])
                .then(isMatch => {
                    if (isMatch) {
                        console.log('[STATUS] Bin retrieved, password authenticated');
                        return res.status(200).json(bin);
                    } else {
                        console.log('[STATUS] Bin retrieved, invalid password');
                        return res.status(401).json({ message: 'Invalid password' });
                    }
                })
                .catch(err => {
                    console.error('[ERROR] Password comparison error', err);
                    return res.status(401).json({ message: 'Authentication failed' });
                })
        })
        .catch(err => {
            console.error('[ERROR] Failed to retrieve bin', err);
            res.status(500).json({ message: 'Failed to retrieve bin' });
        });
});

// Backend Listen
app.listen(3000, () => {
    console.log('[STATUS] Server is listeing on port 3000');
})
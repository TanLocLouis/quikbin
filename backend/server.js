const express = require('express');
const cors = require('cors');
const { MongoClient  } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

require('dotenv').config();
// Connect to MongoDB
// const uri = 'mongodb://' + 
// process.env.MONGO_DB_USERNAME + ':' + 
// process.env.MONGO_DB_PASSWORD +'@' + 
// process.env.MONGO_DB_HOST + ':27017/';
const uri = process.env.MONGO_DB_URL;

const client = new MongoClient(uri);
client.connect()
    .then(() => console.log('[STATUS] Connected to MongoDB'))
    .catch(err => console.error('[ERROR] Failed to connect to MongoDB', err));

const bcrypt = require('bcrypt');
async function hashPassword(plainPassword) {
  const saltRounds = 10;
  const hashed = await bcrypt.hash(plainPassword, saltRounds);
  return hashed;
}

// Create a new bin
app.post('/create', async (req, res) => {
    const db = client.db('quikbin');
    const collection = db.collection('bins');
    const bin = req.body.data;

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


// Get a bin by ID
app.get('/get/:id', (req, res) => {
    const db = client.db('quikbin');
    const collection = db.collection('bins');
    const id = req.params.id;
    
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
            // if bin used,
            // require to auth password
            else {
                // if user send password return ok
                if (req.query && req.query.password) {
                    bcrypt.compare(req.query.password, bin['password'], (err, result) => {
                        if (err) {
                            console.log('[STATUS] Bin retrieved, require password, error', err);
                            return res.status(401).json(null);
                        }

                        // if right password
                        // return bin data
                        if (result) {
                            console.log('[STATUS] Bin retrieved, require password, right password', bin);
                            return res.status(200).json(bin);
                        }
                        // if wrong password
                        // return 401
                        // and require password again
                        else {
                            console.log('[STATUS] Bin retrieved, require password, wrong password');
                            return res.status(401).json(null);
                        }
                    })
                }
                // if user not send require password
                else {
                    console.log('[STATUS] Bin retrieved, require password');
                    return res.status(401).json(null);
                }
            }
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
const express = require('express');
const cors = require('cors');
const { MongoClient  } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

require('dotenv').config();
// Connect to MongoDB
const uri = 'mongodb://' + 
process.env.MONGO_DB_USERNAME + ':' + 
process.env.MONGO_DB_PASSWORD +'@' + 
process.env.MONGO_DB_HOST + ':27017/';
const client = new MongoClient(uri);
client.connect()
    .then(() => console.log('[STATUS] Connected to MongoDB'))
    .catch(err => console.error('[ERROR] Failed to connect to MongoDB', err));

app.post('/create', (req, res) => {
    const db = client.db('quikbin');
    const collection = db.collection('bins');
    const bin = {
        text: req.body.text,
        metadata: req.body.metadata,
    };

    collection.insertOne(bin)
        .then(result => {
            console.log('[STATUS] Bin created', result.insertedId);
            res.status(201).json({ message: 'Bin created', id: result.insertedId });
        })
        .catch(err => {
            console.error('[ERROR] Failed to create bin', err);
            res.status(500).json({ message: 'Failed to create bin' });
        });
});

// Backend Listen
app.listen(3000, () => {
    console.log('[STATUS] Server is listeing on port 5000');
})
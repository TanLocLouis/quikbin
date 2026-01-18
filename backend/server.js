import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

import binRoutes from './routes/binRoutes.js';

app.use('/api/bin', binRoutes);

// Backend Listen
app.listen(3000, () => {
    console.log('[STATUS] Server is listeing on port 3000');
})
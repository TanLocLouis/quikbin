import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

import binRoutes from './routes/binRoutes.js';
import authRoutes from './routes/authRoutes.js';
import usersRoutes from './routes/usersRoutes.js';

// Routes
app.use('/api/bin', binRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

// Backend Listen
app.listen(3000, () => {
    console.log('[STATUS] Server is listeing on port 3000');
})
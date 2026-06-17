import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

import binsRoutes from './routes/binsRoutes.js';
import authRoutes from './routes/authRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import bookmarksRoutes from './routes/bookmarksRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
// import dashboardRoutes from './routes/dashboardRoutes.js';

// Routes
app.use('/api/bins', binsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/bookmarks', bookmarksRoutes);
app.use('/api/dashboard', dashboardRoutes);
// app.use('/api/dashboard', dashboardRoutes);
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger-output.json' with { type: 'json' };
 // Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Backend Listen
app.listen(3000, () => {
    console.log('[STATUS] Server is listeing on port 3000');
})
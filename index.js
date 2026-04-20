import express from 'express';
import "dotenv/config";
import cors from 'cors';

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

import welcome from './src/middlewares/welcome.js';
app.get('/', welcome);

import authRouter from './src/routes/auth.router.js';
app.use('/api/auth', authRouter);

import recipesRouter from './src/routes/recipes.router.js';
app.use('/api/recipes', recipesRouter);

import ratingsRouter from './src/routes/ratings.router.js';
app.use('/api/ratings', ratingsRouter);

import notFound from './src/middlewares/not-found.js';
app.use(notFound);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
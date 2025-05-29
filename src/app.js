import express from 'express';
import json from 'body-parser';
import pumpRoutes from './routes/pumpRoutes.js';

const app = express();

app.use(json());
app.use('/images', express.static('Images'));
app.use(pumpRoutes);

export default app;
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import "./db";
import hobbyRoutes from './routes/hobbyRoutes';
import EventRoutes from './routes/eventRoutes';
import AuthRoutes from './routes/AuthRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth',AuthRoutes);
app.use('/api/events',EventRoutes);
app.use('/api/hobbies',hobbyRoutes);

export default app;

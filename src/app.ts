import dotenv from 'dotenv';
import express from "express";
import cors from "cors";
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import matchRoutes from './routes/matchRoutes';

dotenv.config();

const app = express();

app.use(express.json());
// app.use(cors());

//Routes

//auth
app.use('/auth', authRoutes)

//user
app.use('/user', userRoutes)

//match
app.use('/match', matchRoutes)

//matches

export default app
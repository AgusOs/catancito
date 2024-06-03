import dotenv from 'dotenv';
import express from "express";

dotenv.config();

const app = express();

app.use(express.json());

//Routes
//auth
//user
//match
//matches

export default app
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import tasksRoutes from './routes/tasks.routes.js';

const app = express(); //create express app

app.use(cors({
    origin: 'http://localhost:5173',
})); //enable cors
app.use(morgan('dev')); //log requests to console

app.use(express.json()); //parse json bodies 

app.use(cookieParser()); //parse cookies

app.use("/api", authRoutes); //use auth routes
app.use("/api", tasksRoutes); //use tasks routes

export default app; //export app
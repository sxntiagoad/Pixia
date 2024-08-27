import express from 'express';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
const app = express(); //create express app

app.use(morgan('dev')); //log requests to console

app.use(express.json()); //parse json bodies 

app.use("/api", authRoutes); //use auth routes
export default app; //export app
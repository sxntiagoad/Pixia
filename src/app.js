import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import tasksRoutes from './routes/tasks.routes.js';
import imageRoutes from './routes/image.routes.js';

const app = express(); //create express app

app.use(morgan('dev')); //log requests to console
app.use(cors({
  origin: 'http://localhost:5173', // Ajusta esto a la URL de tu frontend
  credentials: true
})); //enable CORS
app.use(express.json()); //parse json bodies 
app.use(cookieParser()); //parse cookies

// Rutas
app.use("/api/images", imageRoutes); //use image routes
app.use("/api/auth", authRoutes); //use auth routes
app.use("/api", tasksRoutes); //use tasks routes

// Middleware para manejar rutas no encontradas (404)
app.use((req, res, next) => {
    console.error(`Ruta no encontrada: ${req.method} ${req.url}`);
    res.status(404).json({
        mensaje: 'Ruta no encontrada',
        método: req.method,
        ruta: req.url
    });
});

// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error(`Error en la solicitud: ${req.method} ${req.url}`);
    console.error(err);
    res.status(500).json({
        mensaje: 'Error interno del servidor',
        error: err.message
    });
});

export default app; //export app
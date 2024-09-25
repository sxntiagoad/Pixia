import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import tasksRoutes from './routes/tasks.routes.js';
import imageRoutes from './routes/image.routes.js';


const app = express(); //create express app

app.use(cors({
    origin: 'http://localhost:5173',
})); //enable cors
app.use(morgan('dev')); //log requests to console
app.use(express.json({ limit: '50mb' })); //parse json bodies with increased limit
app.use(express.urlencoded({ limit: '50mb', extended: true })); //parse url encoded bodies with increased limit
app.use(cookieParser()); //parse cookies

// Rutas
app.use("/api/images", imageRoutes); //use image routes
app.use("/api", authRoutes); //use auth routes
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

// Aumenta el tiempo de espera a 2 minutos (120000 ms)
app.use((req, res, next) => {
    res.setTimeout(120000, () => {
        console.log('Request has timed out.');
        res.send(408);
    });
    next();
});

export default app; //export app
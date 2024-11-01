import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import imageRoutes from './routes/image.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import promptRoutes from './routes/prompt.routes.js';
import templateRoutes from './routes/template.routes.js';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Primero creamos la aplicación
const app = express();

// Definir la ruta correcta al frontend
const FRONTEND_PATH = 'C:/Users/ricom/OneDrive/Desktop/Pixia/pixia';

// Middlewares
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Configurar la ruta estática para servir los assets desde el frontend
app.use('/assets', express.static(path.join(FRONTEND_PATH, 'src/assets')));

// Rutas
app.use("/api/images", imageRoutes);
app.use("/api", authRoutes);
app.use('/api/prompts', promptRoutes);
app.use('/api', templateRoutes);

// Servir archivos estáticos en producción
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
    });
}

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
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
});

// Aumenta el tiempo de espera a 2 minutos
app.use((req, res, next) => {
    res.setTimeout(120000, () => {
        console.log('Request has timed out.');
        res.send(408);
    });
    next();
});

export default app;

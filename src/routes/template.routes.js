import { Router } from 'express';
import { getTemplates, processWithTemplate } from '../controllers/template.controller.js';
import { listImagesInFolder } from '../s3config.js';
const router = Router();

router.get('/', getTemplates);
router.post('/process', processWithTemplate);
router.get('/pngtemplates', async (req, res) => {
    try {
        const urls = await listImagesInFolder();
        res.json(urls); // Enviamos directamente el array de URLs
    } catch (error) {
        console.error('Error al obtener templates:', error);
        res.status(500).json({ error: 'Error al obtener templates' });
    }
});

export default router; 
import { Router } from 'express';
import { getTemplates, processWithTemplate } from '../controllers/template.controller.js';

const router = Router();

router.get('/', getTemplates);
router.post('/process', processWithTemplate);

export default router; 
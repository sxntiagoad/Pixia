import { Router } from 'express';
import { createTemplate, getTemplates, getTemplateById, upload } from '../controllers/template.controller.js';

const router = Router();

router.post('/templates', 
  upload.fields([
    { name: 'preview', maxCount: 1 },
    { name: 'base', maxCount: 1 }
  ]),
  createTemplate
);

router.get('/templates', getTemplates);
router.get('/templates/:id', getTemplateById);

export default router;

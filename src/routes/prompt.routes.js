import { Router } from 'express';
import { processPrompt } from '../controllers/prompt.controller.js';

const router = Router();

router.post('/process', processPrompt);

export default router;

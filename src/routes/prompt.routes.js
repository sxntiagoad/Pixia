import { Router } from 'express';
import { processPrompt, processVacancyPrompt, processVacancyTexts } from '../controllers/prompt.controller.js';

const router = Router();

router.post('/process', processPrompt);
router.post('/vacancy-prompt', processVacancyPrompt);
router.post('/vacancy-texts', processVacancyTexts);
export default router;

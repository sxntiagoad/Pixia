import { Router } from 'express';
import { createVacancy, getVacancies } from '../controllers/vacancy.controller.js';

const router = Router();

router.post('/vacancies', createVacancy);
router.get('/vacancies', getVacancies);

export default router;

import express from 'express';
import { getDailyAffirmation } from '../controllers/affirmationController';

const router = express.Router();

router.get('/daily-affirmation', getDailyAffirmation);

export default router;
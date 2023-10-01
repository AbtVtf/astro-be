import express from 'express';
import { drawTarotCards } from '../controllers/tarotController';

const router = express.Router();

router.get('/draw-tarot-cards/:numberOfCards', drawTarotCards);

export default router;
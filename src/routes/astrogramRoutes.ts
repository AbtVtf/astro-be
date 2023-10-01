import express from 'express';
import { getPlanetaryPositions, getUserPlanetaryPositions } from '../controllers/astrogramController'; 

const router = express.Router();

router.post('/get-planetary-positions', getPlanetaryPositions);
router.get('/user/planetary-positions', getUserPlanetaryPositions);

export default router;

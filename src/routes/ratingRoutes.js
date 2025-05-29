import express from 'express';
const router = express.Router();
import { createRating,  getRating } from '../controllers/ratingController.js'

router.post('/rating', createRating);
router.get('/ratings', getRating);

export default router;
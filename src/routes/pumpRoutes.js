import express from 'express';
const router = express.Router();
import { createPump, getPumps, updateThumbnail, getImages } from '../controllers/pumpController.js';
import upload from '../middleware/upload.js';
import { updateOpeningHours } from '../controllers/pumpController.js';
import { createRating,  getRating } from '../controllers/ratingController.js'
import { verifySession } from "supertokens-node/recipe/session/framework/express";


router.post('/locations', verifySession(), createPump);
router.get('/locations', getPumps);
router.post('/openinghours', updateOpeningHours);
router.post('/images', upload.single('image'), updateThumbnail);
router.post('/rating', verifySession(), createRating);
router.get('/ratings',  getRating);
router.get("/images", getImages )

export default router;
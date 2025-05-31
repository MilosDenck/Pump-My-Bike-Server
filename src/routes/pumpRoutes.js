import express from 'express';
const router = express.Router();
import { createPump, getPumps, updateThumbnail, getImages } from '../controllers/pumpController.js';
import upload from '../middleware/upload.js';
import { updateOpeningHours } from '../controllers/pumpController.js';
import path from 'path'
import fs from 'fs'
import send from 'send'
import { createRating,  getRating } from '../controllers/ratingController.js'



router.all('*', (req, res, next) => {
    console.log("new Connection: ", req.method, req.path, req.ip )
    console.log(req.body)
    next()
})
router.post('/locations', createPump);
router.get('/locations', getPumps);
router.post('/openinghours', updateOpeningHours);
router.post('/images', upload.single('image'), updateThumbnail);
router.post('/rating', createRating);
router.get('/ratings', getRating);
router.get("/images", getImages )

export default router;
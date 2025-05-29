import express from 'express';
const router = express.Router();
import { createPump, getPumps } from '../controllers/pumpController.js';
import upload from '../middleware/upload.js';
import { updateOpeningHours } from '../controllers/pumpController.js';
import path from 'path'
import fs from 'fs'
import send from 'send'
import { createRating,  getRating } from '../controllers/ratingController.js'



router.all('*', (req, res, next) => {
    console.log("new Connection: ", req.method, req.path, req.ip )
    next()
})
router.post('/locations', createPump);
router.get('/locations', getPumps);
router.post('/openinghours', updateOpeningHours);
router.post('/images', upload.single('image'), (req, res) => {
  res.send('Bild hochgeladen');
});
router.post('/rating', createRating);
router.get('/ratings', getRating);
router.get("/images", (req, res) => {
    const id = req.query.id
    const directoryPath = path.join( "Images",id.toString())
    console.log(directoryPath)
    fs.readdir(directoryPath, (err, files) =>{
        if(err){
            console.log('kein dir gefunden')
            send('directory not found')
        }else{
            console.log(files)
            res.send(JSON.stringify(files))
        }
        
    })
})

export default router;
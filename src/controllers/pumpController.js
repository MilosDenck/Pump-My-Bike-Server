import Pump from '../models/pump.js';
import path from 'path';
import fs from 'fs';
import asyncHandler from 'express-async-handler';

export const createPump = asyncHandler(async (req, res) => {
  try {
    const pump = await Pump.create(req.body);
    res.send(pump)
  } catch (err) {
    console.error(err);
    res.status(500).send('error: saving not worked');
  }
  
});

export const getPumps = asyncHandler(async (req, res) => {
  try {
    const pumps = await Pump.findAll();
    res.json(pumps);
  } catch (err) {
    res.status(500).send(err);
  }
});


export const updateOpeningHours = asyncHandler(async (req, res) => {
  const pumpId = req.query.id; 

  const updated = await Pump.update(
    { openinghour: req.body }, 
    { where: { id: pumpId } }
  );

  if (updated[0] === 0) {
    return res.status(404).json({ error: 'not found' });
  }

  res.sendStatus(200);
});

export const updateThumbnail = asyncHandler(async (req, res) => {

  const updated = await Pump.update(
    { thumbnail: req.generatedFilename }, 
    { where: { id: req.locationId } }
  );

  if (updated[0] === 0) {
    return res.status(404).json({ error: 'not found' });
  }

  res.sendStatus(200);
});

export const getImages = asyncHandler( async (req, res) => {
    const id = req.query.id
    console.log(id)
    const directoryPath = path.join( "Images",id.toString())
    fs.readdir(directoryPath, (err, files) =>{
        if(err){
            console.log('kein dir gefunden')
            res.send('directory not found')
        }else{
            res.send(JSON.stringify(files))
        }
        
    })
})


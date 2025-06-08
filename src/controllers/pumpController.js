import Pump from '../models/pump.js';
import path from 'path';
import fs from 'fs';
import asyncHandler from 'express-async-handler';
import { literal } from 'sequelize';
import sequelize from '../config/database.js';


  

export const createPump = asyncHandler(async (req, res) => {
  const session = req.session;
  const date = new Date()
  const userId = session.getUserId();
  const body = req.body
  try {
    const pump = await Pump.create({
      name: body.name,
      lat: body.lat,
      lon: body.lon,
      description: body.description,
      thumbnail: null,
      createdFrom: userId,
      openingHours: body.openingHours,
      createdAt: date
    });
    res.send(pump)
  } catch (err) {
    console.error(err);
    res.status(500).send('error: saving not worked');
  }
  
});


export const getPumps = asyncHandler(async (req, res) => {
  try {

    const lat = parseFloat(req.query.lat);
    const lon = parseFloat(req.query.lon);
    const maxDistance = 5;

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({ error: 'Latitude and longitude must be valid numbers.' });
    }
    const pumps = await sequelize.query(`
        WITH pump_data AS 
        (SELECT *, (111.3 * cos(radians(( lat + ${lat} ) / 2* 0.01745)) * (lon - ${lon})) AS dx , 111.3 * (lat - ${lat}) AS dy 
        FROM pumps)
        SELECT *
        FROM pump_data
        WHERE sqrt(power(dx,2) + power(dy,2)) < ${maxDistance}
        `)

    res.json(pumps[0]);
  } catch (err) {
    console.log(err)
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
  res.send(req.generatedFilename);
});

export const getImages = asyncHandler( async (req, res) => {
    const id = req.query.id
    const directoryPath = path.join( "Images",id.toString())
    fs.readdir(directoryPath, (err, files) =>{
        if(err){
            console.error('directiory not found')
            res.status(404).send('directory not found')
        }else{
            res.status(200).send(JSON.stringify(files))
        }
        
    })
})


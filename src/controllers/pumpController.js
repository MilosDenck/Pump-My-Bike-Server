import Pump from '../models/pump.js';
import asyncHandler from 'express-async-handler';

export const createPump = asyncHandler(async (req, res) => {
  try {
    const pump = await Pump.create(req.body);
    console.log(pump)
    res.json({ id: pump.id });
  } catch (err) {
    console.error(err);
    res.status(500).send('error: saving not worked');
  }
});

export const getPumps = asyncHandler(async (req, res) => {
  try {
    console.log("searched for pumps")
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


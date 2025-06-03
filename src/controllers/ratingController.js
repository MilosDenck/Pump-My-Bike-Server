import asyncHandler from 'express-async-handler';
import  Rating from '../models/Rating.js';
import Pump from '../models/pump.js';
import { fn, col } from '@sequelize/core';
import { where } from 'sequelize';

export const createRating = asyncHandler(async (req, res) => {
  try {
    const { rating, comment, locationId } = req.body;
    if (!rating || rating <= 0 || rating > 5) {
      return res.status(400).json({ error: 'not valid' });
    }
    const userId = req.query.userid

    const pumpId = locationId
    const [newRating, created] = await Rating.upsert({
        rating,
        comment,
        userId,
        pumpId,
    });

    const averageRating = await Rating.findOne({
        attributes: [[fn('AVG', col('rating')), 'avgRating']],
        where: { pumpId:  locationId},
        group: ['pumpId', "id"],
        raw: true
    });

    await Pump.update(
        { rating: averageRating.avgRating }, 
        { where: { id: locationId } }
    );
    res.status(200).send(String(averageRating.avgRating));
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

export const getRating = asyncHandler(async (req, res) => {
  try {
    const pumpWithRatings = await Pump.findByPk(req.params.id, {
        include: Rating
    });

    res.json(pumpWithRatings.Ratings);
  } catch (err) {
    res.status(500).send(err);
  }
});


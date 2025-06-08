import asyncHandler from 'express-async-handler';
import  Rating from '../models/Rating.js';
import Pump from '../models/pump.js';
import { fn, col } from '@sequelize/core';
import { where } from 'sequelize';
import User from '../models/user.js';

export const createRating = asyncHandler(async (req, res) => {
  try {
    const date = new Date()
    const { rating, comment, locationId } = req.body;
    if (!rating || rating <= 0 || rating > 5) {
      return res.status(400).json({ error: 'not valid' });
    }
    const userId = req.session.getUserId()

    const pumpId = locationId
    const [newRating, created] = await Rating.upsert({
        rating: rating,
        comment: comment,
        userId: userId,
        pumpId: pumpId,
        createdAt: date
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
 
    const page = 1; 
    const limit = 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Rating.findAndCountAll({
      where: { pumpId: req.query.id },
      attributes: ['id', 'rating', 'comment', 'createdAt'],
      include: [{
        model: User,
        as: 'user',
        attributes: ['username']
      }],
      limit,
      offset,
      raw: true,
    });

    console.log('Anzahl aller Bewertungen:', count);
    console.log('Aktuelle Seite Bewertungen:', rows);

    res.json(rows);
  } catch (err) {
    console.error(err)
    res.status(500).send(err);
  }
});


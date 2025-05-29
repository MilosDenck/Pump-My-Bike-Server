import { DataTypes } from '@sequelize/core';
import sequelize from '../config/database.js';

const Rating = sequelize.define('Rating', {
  rating: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'ratings',
  timestamps: false,
});

export default Rating;

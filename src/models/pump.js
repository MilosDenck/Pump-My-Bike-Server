import { DataTypes } from '@sequelize/core';
import sequelize from '../config/database.js';

const Pump = sequelize.define('Pump', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lat: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  lon: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  openingHours: {
    type: DataTypes.JSONB, 
  },
  thumbnail: {
    type: DataTypes.STRING,
  },
  rating: {
    type: DataTypes.FLOAT,
  },
  createdFrom: {
    type: DataTypes.STRING,
    //allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'pumps',
  timestamps: false,
});

export default Pump;

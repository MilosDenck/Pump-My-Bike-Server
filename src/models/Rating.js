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
  },
  pumpId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  }
}, {
  tableName: 'ratings',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'pumpId'],
    },
  ],
});

Rating.associate = (models) => {
    Rating.belongsTo(models.User, {
      foreignKey: 'userId',
      targetKey: 'userId',
    });
  };

export default Rating;

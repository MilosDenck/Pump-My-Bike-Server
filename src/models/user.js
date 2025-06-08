import { DataTypes } from '@sequelize/core';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull:false,
        unique: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
  tableName: 'users',
  timestamps: false,
  indexes: [
    {
        unique: true,
        fields: ['username']
    },
    {
        unique: true,
        fields: ['email']
    }
  ]
});

User.associate = (models) => {
    User.hasMany(models.Rating, {
      foreignKey: 'userId',
      sourceKey: 'userId',
    });
  };

export default User;

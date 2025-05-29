import sequelize from './src/config/database.js';
import app from './src/app.js';
import Pump from './src/models/pump.js';
import Rating from './src/models/Rating.js';


console.log('DB_USER:', typeof process.env.DB_USER, process.env.DB_USER);
console.log('DB_PASSWORD:', typeof process.env.DB_PASSWORD, process.env.DB_PASSWORD);
Pump.hasMany(Rating, { foreignKey: 'pumpId' });
Rating.belongsTo(Pump, { foreignKey: 'pumpId' });

sequelize.sync({ alter: true }).then(() => {
    app.listen(8000, '0.0.0.0', () => {
        console.log('Server läuft auf IPv4');
    });
}).catch(console.error);
import sequelize from './src/config/database.js';
import app from './src/app.js';
import Pump from './src/models/pump.js';
import Rating from './src/models/Rating.js';

Pump.hasMany(Rating, { foreignKey: 'pumpId' });
Rating.belongsTo(Pump, { foreignKey: 'pumpId' });

sequelize.sync({ alter: true }).then(() => {
    app.listen(8000, '0.0.0.0', () => {
        console.log('Server läuft auf IPv4');
    });
}).catch(console.error);
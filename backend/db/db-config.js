const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.UBER_DB_NAME, process.env.UBER_DB_USER, process.env.UBER_DB_PASSWORD, {
    host: process.env.UBER_DB_HOST,
    port: process.env.UBER_DB_PORT,
    dialect: 'postgres',
    define: {
        timestamps: false
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("../models/users")(sequelize, Sequelize);
db.buses = require("../models/buses")(sequelize, Sequelize);
db.bookings = require("../models/bookings")(sequelize, Sequelize);

db.buses.hasMany(db.bookings, {
    foreignKey: {name: "bus_id", allowNull: false}
});

db.users.hasMany(db.bookings, {
    foreignKey: {name: "user_id", allowNull: false}
});

db.bookings.belongsTo(db.users, { foreignKey: 'user_id' });
db.bookings.belongsTo(db.buses, { foreignKey: 'bus_id' });

db.seed = async() => {
    const count = await db.buses.count();
    if(!count) {
        db.buses.create({
            bus_name: 'Peter Pan',
            seats: 30
        });
        db.buses.create({
            bus_name: 'Mega Bus',
            seats: 28
        });
        db.buses.create({
            bus_name: 'MBTA',
            seats: 33
        });
        db.buses.create({
            bus_name: 'Flix Bus',
            seats: 40
        });
    }
}

module.exports = db;

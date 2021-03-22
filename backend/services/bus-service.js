const db = require("../db/db-config");
const Buses = db.buses;
//get all bookings
exports.getBuses = () => {
    return Buses.findAll();
}

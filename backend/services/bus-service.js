const db = require("../db/db-config");
const Buses = db.buses;

exports.getBuses = () => {
    return Buses.findAll();
}

const db = require("../db/db-config");
const Booking = db.bookings;
//add the bus bookings
exports.addBooking = (booking) => {
    return Booking.create(booking);
}
//get bookings by user_name
exports.getUserBookings = (user_id) => {
    return Booking.findAll({
        where: {
            user_id: user_id
        },
        include: [db.users, db.buses]
    });
}

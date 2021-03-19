const mongoose = require('mongoose');

var bookingSchema = new mongoose.Schema({
    Booking_id:{
        type:String
    },
    Bus_id:{
        type:String
    },
    User_id:{
        type:String
    },
	Seats:{
		type:Number,
	},
    Booking_Date:{
        type:Date
    }
});


module.exports = mongoose.model('Booking',bookingSchema);
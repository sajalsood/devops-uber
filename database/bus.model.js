const { Int32 } = require('bson');
const mongoose = require('mongoose');

var BusSchema = new mongoose.Schema({
    Bus_id:{
        type:String
    },
	Source:{
		type:String,
	},
    Destination:{
        type:String
    },
	Total_seats:{
		type:Number,
	},
    Available_seats:{
        type:Number
    }
});


module.exports = mongoose.model('Bus',BusSchema);
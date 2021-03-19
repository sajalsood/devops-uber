const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    User_id:{
        type:String
    },
	UserName:{
		type:String,
	},
    Email:{
        type:String
    },
	Password:{
		type:String,
	}
});


module.exports = mongoose.model('User',userSchema);
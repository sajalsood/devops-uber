const db = require("../db/db-config");
const Users = db.users;
//check if user exists
exports.isUserExists = (user_name, password) => {
    return Users.count({
        where: {
            user_name: user_name,
            password: password
        }
    });
}
//get the user using user_name
exports.getUser = (user_name) => {
    return Users.findOne({
        where: {
            user_name: user_name
        }
    });
}
//add the user 
exports.addUser = (user) => {
    return Users.create(user);
}

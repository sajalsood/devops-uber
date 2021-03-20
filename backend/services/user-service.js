const db = require("../db/db-config");
const Users = db.users;

exports.isUserExists = (user_name) => {
    return Users.count({
        where: {
            user_name: user_name
        }
    });
}

exports.getUser = (user_name) => {
    return Users.findOne({
        where: {
            user_name: user_name
        }
    });
}

exports.addUser = (user) => {
    return Users.create(user);
}

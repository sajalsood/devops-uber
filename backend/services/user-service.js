const db = require("../db/db-config");
const Users = db.users;

exports.isUserExists = (user_name, password) => {
    return Users.count({
        where: {
            user_name: user_name,
            password: password
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

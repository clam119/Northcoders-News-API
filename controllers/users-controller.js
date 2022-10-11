const { fetchAllUsers } = require('../models/users-model');

exports.getAllUsers = (req, res, next) => {
    fetchAllUsers()
    .then((usersData) => {
        res.status(200).send(usersData);
    })
}
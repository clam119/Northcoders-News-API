const { fetchAllUsers, fetchUserByUsername } = require('../models/users-model');

exports.getAllUsers = (req, res, next) => {
    fetchAllUsers()
    .then((usersData) => {
        res.status(200).send(usersData);
    })
    .catch(next);
}

exports.getUserByUsername = (req, res, next) => {
    const { username } = req.params;
    fetchUserByUsername(username)
    .then((userData) => {
        res.status(200).send(userData);
    })
    .catch(next);
}
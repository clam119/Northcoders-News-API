const userRouter = require('express').Router();
const { getAllUsers, postNewUser, getUserByUsername } = require('../controllers/users-controller');

userRouter
    .route('/')
    .get(getAllUsers)
    .post(postNewUser)

userRouter
    .route('/:username')
    .get(getUserByUsername)

module.exports = userRouter;
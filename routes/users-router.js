const userRouter = require('express').Router();
const { getAllUsers } = require('../controllers/users-controller');

userRouter
    .route('/')
    .get(getAllUsers);

module.exports = userRouter;
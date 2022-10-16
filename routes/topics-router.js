const topicsRouter = require('express').Router();
const { getAllTopics, createNewTopic } = require('../controllers/topics-controller');

topicsRouter
    .route('/')
    .get(getAllTopics)
    .post(createNewTopic)

module.exports = topicsRouter;
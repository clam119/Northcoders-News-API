const { fetchAllTopics } = require('../models/topics-model');

exports.getAllTopics = (req, res, next) => {

    fetchAllTopics()
    .then((topicsData) => {
        res.status(200).send(topicsData);
    })
    .catch((err) => {
        next(err)
    });
}


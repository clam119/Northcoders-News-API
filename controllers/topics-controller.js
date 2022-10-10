const { fetchAllTopics } = require('../models/topics-model');

exports.getAllTopics = (req, res, next) => {

    fetchAllTopics()
    .then((topicsData) => {
        res.status(200).send({topicsData});
    })
    .catch((err) => {
        console.log('An error has occurred when getting topics', err);
        next(err);
    })
}

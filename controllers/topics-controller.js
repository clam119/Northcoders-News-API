const { fetchAllTopics, postNewTopic } = require('../models/topics-model');

exports.getAllTopics = (req, res, next) => {

    fetchAllTopics()
    .then((topicsData) => {
        res.status(200).send(topicsData);
    })
    .catch((err) => {
        next(err)
    });
}

exports.createNewTopic = (req, res, next) => {
    const { slug, description } = req.body;
    postNewTopic(slug, description)
    .then((postedTopic) => {
        res.status(201).send(postedTopic);
    })
    .catch(next);
}


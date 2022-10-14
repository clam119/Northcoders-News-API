const { getEndpoints } = require('../models/api-model');

exports.getAvailableEndpoints = async (req, res, next) => {
    const endpoints = getEndpoints()
    res.status(200).send({ endpoints })
}
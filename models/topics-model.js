const db = require('../db/connection');

exports.fetchAllTopics = () => {
    return db
    .query(`SELECT * FROM topics;`)
    .then(({rows: topicsData}) => {
        console.log(topicsData);
        return topicsData;
    })
}
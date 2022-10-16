const db = require('../db/connection');

exports.fetchAllTopics = () => {
    return db
    .query(`SELECT * FROM topics;`)
    .then(({rows: topicsData}) => {
        return topicsData;
    })
}

exports.postNewTopic = async (slug, description) => {

    //Conditional Logic - Check if required fields existent or not
    if(slug === undefined) return Promise.reject({status: 400, msg: "Slug Field Missing"});
    if(description === undefined) return Promise.reject({status: 400, msg: "Description Field Missing"});
    if(slug && description === undefined) return Promise.reject({status: 400, msg: "Required Fields Missing"});

    const response = await db.query(`INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *;`, [slug, description])
    const { rows: [postedComment] } = await response;
    return postedComment
}
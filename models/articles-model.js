const db = require('../db/connection');

exports.fetchArticleByID = (article_id) => {
    return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({rows: articleData}) => {
        if(articleData.length === 0) {
            throw new Error;
        }
        else {
            return articleData;
        }
    })
    .catch((err) => {
       if(err.code === '22P02') {
        return Promise.reject({status: 400, msg: 'Invalid Data Type'})
       } 
       
       return Promise.reject({status: 404, msg: 'That article does not exist'})
    })
}

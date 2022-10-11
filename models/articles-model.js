const db = require('../db/connection');

exports.fetchArticleByID = (article_id) => {
    return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({rows: articleData}) => {
        if(articleData.length === 0) {
            return Promise.reject({status: 404, msg: 'Article not found'});
        }
        else {
            return articleData;
        }
    })
}

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

exports.updateArticleByID = (article_id, inc_votes) => {
    return db
    .query(`UPDATE articles SET votes = (votes + $1) WHERE article_id = $2 RETURNING *;`, [inc_votes, article_id])
    .then(({rows: [updatedArticleData]}) => {
        return updatedArticleData
    })
}


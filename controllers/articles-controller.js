const { fetchArticleByID, updateArticleByID } = require('../models/articles-model');

exports.getArticleByID = (req, res, next) => {
    const { article_id } = req.params;
    
    fetchArticleByID(article_id)

    .then((articleData) => {
        res.status(200).send({articleData});
    })

    .catch(next);
}

exports.patchArticleByID = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;  
    updateArticleByID(article_id, inc_votes)

    .then((updatedArticleData) => {
        res.status(200).send({updatedArticleData});
    })
    .catch(next);
}
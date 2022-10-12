const { fetchArticleByID, updateArticleByID, fetchAllArticles } = require('../models/articles-model');

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

exports.getAllArticles = (req, res, next) => {
    const { topic } = req.query;
    
    fetchAllArticles(topic)
    .then((allArticlesData) => {
        res.status(200).send(allArticlesData);
    })
    .catch(next)
}
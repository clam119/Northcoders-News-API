const { fetchArticleByID, updateArticleByID, fetchAllArticles, fetchCommentsByID, createCommentByID } = require('../models/articles-model');

exports.getArticleByID = (req, res, next) => {
    const { article_id } = req.params;
    
    fetchArticleByID(article_id)

    .then((articleData) => {
        res.status(200).send(articleData);
    })

    .catch(next);
}

exports.patchArticleByID = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;  
    updateArticleByID(article_id, inc_votes)

    .then((updatedArticleData) => {
        res.status(200).send(updatedArticleData);
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

exports.getCommentsByID = (req, res, next) => {
    const { article_id } = req.params;
    fetchCommentsByID(article_id)
    .then((commentsByID) => {
        res.status(200).send(commentsByID);
    })
    .catch(next);
}

exports.postCommentByArticleID = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;
    createCommentByID(article_id, username, body)
    .then((postedComment) => {
        res.status(201).send(postedComment);
    })
    .catch(next);
}
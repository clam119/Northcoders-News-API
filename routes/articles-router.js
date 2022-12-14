const articlesRouter = require('express').Router();
const { getArticleByID, patchArticleByID, getAllArticles, getCommentsByID, postCommentByArticleID, postNewArticle, removeArticleByID } = require('../controllers/articles-controller');

articlesRouter 
    .route('/')
    .get(getAllArticles)
    .post(postNewArticle)

articlesRouter
    .route('/:article_id')
    .get(getArticleByID)
    .patch(patchArticleByID)
    .delete(removeArticleByID)

articlesRouter
    .route('/:article_id/comments')
    .get(getCommentsByID)
    .post(postCommentByArticleID)



module.exports = articlesRouter;
const commentsRouter = require('express').Router();
const { deleteCommentByID } = require('../controllers/comments-controller.js');

commentsRouter
    .route('/:comment_id')
    .delete(deleteCommentByID);

module.exports = commentsRouter;
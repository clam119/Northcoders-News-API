const commentsRouter = require('express').Router();
const { deleteCommentByID, patchCommentByID } = require('../controllers/comments-controller.js');

commentsRouter
    .route('/:comment_id')
    .delete(deleteCommentByID)
    .patch(patchCommentByID)

module.exports = commentsRouter;
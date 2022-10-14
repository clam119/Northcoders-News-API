const { deleteComment } = require('../models/comments-model.js');

exports.deleteCommentByID = (req, res, next) => {
    const { comment_id } = req.params;
    
    deleteComment(comment_id)
    .then((response) => {
        res.status(204).send(response);
    })
    .catch(next);
}
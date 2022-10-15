const { deleteComment, updateCommentByID } = require('../models/comments-model.js');

exports.deleteCommentByID = (req, res, next) => {
    const { comment_id } = req.params;
    
    deleteComment(comment_id)
    .then((response) => {
        res.status(204).send(response);
    })
    .catch(next);
}

exports.patchCommentByID = (req, res, next) => {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;

    updateCommentByID(comment_id, inc_votes)
    .then((response) => {
        res.status(200).send(response);
    })
    .catch(next);
}
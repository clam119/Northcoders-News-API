const db = require("../db/connection");

exports.deleteComment = async (comment_id) => {
    const checkDbCommentID = await db.query(`SELECT comment_id FROM comments`)
    const validCommentIDs = [...checkDbCommentID.rows]

    let filterNums = /\d+/.test(comment_id)
    
    // if(comment_id > validCommentIDs.length) {
    //     return Promise.reject({ status: 404, msg: "Comment with that ID not found" });
    // }

    if(!filterNums) {
        return Promise.reject({ status: 400, msg: "Invalid Data Type" });
    }

   await db.query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id]);
}

exports.updateCommentByID = async (comment_id, inc_votes) => {
    const checkDbCommentID = await db.query(`SELECT comment_id FROM comments`)
    const validCommentIDs = [...checkDbCommentID.rows];
    
    let filterNumsID = /\d+/.test(comment_id);
    let filterNums = /\d+/.test(inc_votes);

    if(comment_id > validCommentIDs.length) {
        return Promise.reject({status: 404, msg: "Comment with that ID not found"})
    }

    if (inc_votes === undefined || !filterNumsID || !filterNums) {
        return Promise.reject({ status: 400, msg: "Invalid Data Type" });
    }

    const response = await db.query(`UPDATE comments SET votes = (votes + $1) WHERE comment_id = $2 RETURNING *;`, [inc_votes, comment_id]);
    const { rows: [updatedComment] } = await response;

    return updatedComment;
}


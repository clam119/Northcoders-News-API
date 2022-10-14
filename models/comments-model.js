const db = require("../db/connection");

exports.deleteComment = async (comment_id) => {
    const checkDbCommentID = await db.query(`SELECT comment_id FROM comments`)
    const validCommentIDs = [...checkDbCommentID.rows]

    let filterNums = /\d+/.test(comment_id)
    
    if(comment_id > validCommentIDs.length) {
        return Promise.reject({ status: 404, msg: "Comment with that ID not found" });
    }

    if(!filterNums) {
        return Promise.reject({ status: 400, msg: "Invalid Data Type" });
    }

   await db.query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id]);
    
    
}
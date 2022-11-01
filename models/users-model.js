const db = require('../db/connection');

exports.fetchAllUsers = () => {
    return db
    .query(`SELECT * FROM users;`)
    .then(({rows: usersData}) => {
        return usersData;
    })
}

exports.fetchUserByUsername = async (username) => {
    const checkDbUsernames = await db.query(`SELECT * FROM users`);
    const validUsernames = await checkDbUsernames.rows.map((user) => user.username)
    const response = await db.query(`SELECT * FROM users WHERE username = $1`, [username]);
    const data = await response;
    const { rows: [userData] } = data;
    
    if(!validUsernames.includes(username)) {
        return Promise.reject({status: 404, msg: "Username not found"})
    }
    
    return userData;
}

exports.createNewUser = async (username, name, avatar_url) => {
    const checkDbUsernames = await db.query(`SELECT * FROM users`);
    const validUsernames = await checkDbUsernames.rows.map((user) => user.username)

    if(validUsernames.includes(username)) {
        return Promise.reject({ status: 400, msg: "Username Already Exists" });
    }
    
    if(typeof username !=='string' || typeof name !== 'string' || typeof avatar_url !== 'string'){
        return Promise.reject({ status: 400, msg: "Invalid Fields Data" })
    }

    const response = await db.query(`INSERT INTO users(username, name, avatar_url) VALUES ($1, $2, $3) RETURNING *;`, [username, name, avatar_url])
    const data = await response;
    const { rows: [userData] } = data;

    return userData;
}

exports.createCommentByID = (article_id, username, body) => {
    return db
      .query(
        `INSERT INTO comments(author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`,
        [username, body, article_id]
      )
      .then(({ rows: [postedComment] }) => {
        return postedComment;
      });
  };
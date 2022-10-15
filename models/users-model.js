const db = require('../db/connection');

exports.fetchAllUsers = () => {
    return db
    .query(`SELECT * FROM users;`)
    .then(({rows: usersData}) => {
        return usersData;
    })
}

exports.fetchUserByUsername = async (username) => {
    const response = await db.query(`SELECT * FROM users WHERE username = $1`, [username]);
    const data = await response;
    const { rows: [userData] } = data;
    return userData;
}

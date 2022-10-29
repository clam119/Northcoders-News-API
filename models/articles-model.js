const db = require("../db/connection");

exports.fetchArticleByID = (article_id) => {
  return db
    .query(
      `
    SELECT articles.*, COUNT(comments.author) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id 
    `,
      [article_id]
    )
    .then(({ rows: articleData }) => {
      if (articleData.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      } else {
        return articleData[0];
      }
    });
};

exports.postArticle = async (author, title, body, topic) => {
  //Declaring Variables To Check Valid Authors & Topics
  const {rows: userNamesArray} = await db.query(`SELECT * FROM users`)
  const validUsernames = userNamesArray.map(user =>user.username);
  const {rows: topicsArray} = await db.query(`SELECT * FROM topics`)
  const validTopics = topicsArray.map(topic =>topic.slug);

  //Checks if any fields are missing
  if(author === undefined || title === undefined || body === undefined || topic === undefined) {
    return Promise.reject({status: 404, msg: 'Field Missing'});
  }

  if(!validUsernames.includes(author)) {
    return Promise.reject({status: 404, msg: 'Username Not Found'});
  }
  
  if(!validTopics.includes(topic)) {
    return Promise.reject({status: 404, msg: 'Topic Not Found'});
  }

  const insertArticle = await db.query(`INSERT INTO articles (author, title, body, topic) VALUES ($1, $2, $3, $4) RETURNING article_id;`, [author, title, body, topic]);
  const { rows: [insertedArticleID] } = await insertArticle;
  const newArticleID = insertedArticleID.article_id;
  const { rows: [queryNewArticle] } =  await db.query(`SELECT articles.*, COUNT(comments.author) ::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;`, [newArticleID]);

  if(validUsernames.includes(author) && validTopics.includes(topic)) {
    return queryNewArticle;
  }
}

exports.fetchAllArticles = async (topic, sort_by = "created_at", order = "DESC") => {
  let baseQuery = `SELECT articles.*, COUNT(comments.author) as comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id`;
  const queryValues = [];
  const validColumns = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "comment_count",
  ];
  const validOrders = ["ASC", "DESC", "asc", "desc"];

  if (topic) {
    baseQuery += ` WHERE articles.topic = $1`;
    queryValues.push(topic);
    const checkDb = await db.query(`SELECT * FROM topics WHERE slug = $1;`, queryValues)
    if(checkDb.rows.length === 0) {
      return Promise.reject({status: 404, msg: "Article with that topic not found"})
    }
  }

  if (!validColumns.includes(sort_by) || !validOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid Data Type" });
  }

  baseQuery += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order.toUpperCase()}`;

  return db.query(baseQuery, queryValues).then(({ rows: articles }) => {
    articles.forEach(article => article.total_count = articles.length)
    console.log(articles);
    return articles;
  });
  
};

exports.updateArticleByID = (article_id, inc_votes) => {
  if (typeof inc_votes !== "number") {
    return Promise.reject({ status: 400, msg: "Invalid Data Type" });
  }
  return db
    .query(
      `UPDATE articles SET votes = (votes + $1) WHERE article_id = $2 RETURNING *;`,
      [inc_votes, article_id]
    )
    .then(({ rows: [updatedArticleData] }) => {
      return updatedArticleData;
    });
};

exports.fetchCommentsByID = (article_id) => {
  const existingArticles = [];

  db.query(`SELECT article_id FROM articles`).then(({ rows: articles }) =>
    articles.forEach((article) => existingArticles.push(article))
  );

  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
      [article_id]
    )
    .then(({ rows: comments }) => {
      if (article_id > existingArticles.length) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return comments;
    });
};

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

exports.deleteArticleByID = async (article_id) => {
  let filterNums = /\d+/.test(article_id);

  const checkDb = await db.query(`SELECT * FROM articles`);
  const { rows: validArticles } = await checkDb;
  
  if(article_id > validArticles.length) {
    return Promise.reject({status: 404, msg: "Article not found"});
  }

  if(!filterNums) {
    return Promise.reject({status: 400, msg: "Invalid Data Type"});
  }

  db.query(`DELETE FROM articles WHERE article_id = $1`, [article_id]);
}
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

exports.fetchAllArticles = (topic, sort_by, order) => {
  const acceptableTopicQueries = [];
  const acceptableOrderQueries = ["asc", "desc", "ASC", "DESC"];
  const acceptableSortByQueries = [
    "article_id",
    "votes",
    "ARTICLE_ID",
    "VOTES",
  ];

  if (!acceptableSortByQueries.includes(sort_by) && sort_by !== undefined) {
    return Promise.reject({status: 400, msg: "Invalid Data Type"})
  }

  if(!acceptableOrderQueries.includes(order) && order !== undefined) {
    return Promise.reject({status: 400, msg: "Invalid Data Type"})
  }

  let filteredQueryString = `SELECT articles.*, COUNT(comments.author) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.topic = $1
    GROUP BY articles.article_id `;

  let baseQueryString = `SELECT articles.*, COUNT(comments.author) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id  `;

  if (sort_by) {
    filteredQueryString += `ORDER BY ${sort_by} `;
    baseQueryString += ` ORDER BY ${sort_by} `;
  }

  if (order) {
    filteredQueryString += order;
    baseQueryString += order;
  }

  if (sort_by === undefined || sort_by.length === 0) {
    sort_by = "created_at";
    filteredQueryString += `ORDER BY ${sort_by} `;
    baseQueryString += `ORDER BY ${sort_by} `;
  }

  if (order === undefined || order.length === 0) {
    order = "DESC";
    filteredQueryString += order;
    baseQueryString += order;
  }
 

  return db
    .query(`SELECT slug FROM topics`)
    .then(({ rows: topics }) =>
      topics.forEach((topic) => acceptableTopicQueries.push(topic.slug))
    )
    .then(() => {
      //Condition 1: If topic isn't given by default then will regularly query
      //All articles in descending creation date order & reject 404 if no articles found

      if(!acceptableSortByQueries.includes(sort_by) && sort_by === undefined) {
        return Promise.reject({status: 400, msg: "Invalid Data Type"});
      }

      if(!acceptableOrderQueries.includes(order) && sort_by === undefined) {
        return Promise.reject({status: 400, msg: "Invalid Data Type"});
      }

      if (topic === undefined || topic.length === 0) {
        return db.query(baseQueryString).then(({ rows: allArticlesData }) => {
          if (allArticlesData.length === 0) {
            return Promise.reject({ status: 404, msg: "Article not found" });
          } else {
            return allArticlesData;
          }
        });
      }

      //Condition 2: If no topics queried & not within acceptableQueries, will return 404
      if (!acceptableTopicQueries.includes(topic) && topic.length !== 0) {
        return Promise.reject({
          status: 404,
          msg: "Article with that topic not found",
        });
      }

      //Condition 3: If acceptable query given then will return filteredArticles of specified topic
      if (acceptableTopicQueries.includes(topic) && topic.length > 1) {
        return db
          .query(filteredQueryString, [topic])
          .then(({ rows: filteredArticlesData }) => {
            return filteredArticlesData;
          });
      }
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

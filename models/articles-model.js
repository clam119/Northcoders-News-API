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

exports.fetchAllArticles = (topic) => {
  const acceptableQueries = [];

  let filteredQueryString = `SELECT articles.*, COUNT(comments.author) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.topic = $1
    GROUP BY articles.article_id 
    ORDER BY articles.created_at DESC`;

  let baseQueryString = `SELECT articles.*, COUNT(comments.author) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id 
    ORDER BY articles.created_at DESC`;

  return db
    .query(`SELECT slug FROM topics`)
    .then(({ rows: topics }) =>
      topics.forEach((topic) => acceptableQueries.push(topic.slug))
    )
    .then(() => {
      //Condition 1: If topic isn't given by default then will regularly query
      //All articles in descending creation date order & reject 404 if no articles found
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
      if (!acceptableQueries.includes(topic) && topic.length !== 0) {
        return Promise.reject({
          status: 404,
          msg: "Article with that topic not found",
        });
      }

      //Condition 3: If acceptable query given then will return filteredArticles of specified topic
      if (acceptableQueries.includes(topic) && topic.length > 1) {
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
  return db
  .query(`SELECT comments.* FROM comments LEFT JOIN articles ON comments.article_id = articles.article_id WHERE comments.article_id = $1 ORDER BY comments.created_at DESC;`, [article_id])
  .then(({rows: comments}) => {
    if(comments.length === 0) {
      return Promise.reject({status: 404, msg: "No comments found"});
    }
    else {
      return comments
    }
  })
}
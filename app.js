const { getAvailableEndpoints } = require('./controllers/api-controller');
const { getAllTopics } = require('./controllers/topics-controller');
const { getAllUsers } = require('./controllers/users-controller');
const { getArticleByID, patchArticleByID, getAllArticles, getCommentsByID, postCommentByArticleID } = require('./controllers/articles-controller');
const { deleteCommentByID } = require('./controllers/comments-controller.js');
const { handleCustomErrors, handlePsqLErrors, handle500Errors } = require('./errors');
const express = require('express');
const app = express();

app.use(express.json());

// Task 2 - 'GET /api/topics'
app.get('/api/topics', getAllTopics);

// Task 3 - 'GET /api/articles/:article_id'
app.get('/api/articles/:article_id', getArticleByID);

// Task 4 - 'GET /api/users'
app.get('/api/users', getAllUsers);

// Task 5 - 'PATCH /api/articles/:article_id
app.patch('/api/articles/:article_id', patchArticleByID);

//Task 6 - 'GET /api/articles'
app.get('/api/articles', getAllArticles)

// Task 7 - 'GET /api/articles/:article_id/comments
app.get('/api/articles/:article_id/comments', getCommentsByID);

// Task 8 - 'POST /api/articles/:article_id/comments
app.post('/api/articles/:article_id/comments', postCommentByArticleID);

// Task 9 - 'DELETE /api/comments/:comment_id
app.delete('/api/comments/:comment_id', deleteCommentByID)

// Task 10 - 'GET /api'
app.get('/api', getAvailableEndpoints);

app.all('/*', (req, res, next) => { 
    res.status(404).send({msg: 'path not found'});
})

app.use(handleCustomErrors);
app.use(handlePsqLErrors);
app.use(handle500Errors);

module.exports = app;
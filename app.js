const { getAvailableEndpoints } = require('./controllers/api-controller');
const { getAllTopics } = require('./controllers/topics-controller');
const { getAllUsers } = require('./controllers/users-controller');
const { getArticleByID, patchArticleByID, getAllArticles, getCommentsByID, postCommentByArticleID } = require('./controllers/articles-controller');
const { deleteCommentByID } = require('./controllers/comments-controller.js');
const { handleCustomErrors, handlePsqLErrors, handle500Errors } = require('./errors');
const express = require('express');
const app = express();

app.use(express.json());

// '/api'
app.get('/api', getAvailableEndpoints);

// '/api/topics'
app.get('/api/topics', getAllTopics);

// '/api/users'
app.get('/api/users', getAllUsers);

// '/api/articles'
app.get('/api/articles', getAllArticles)

// '/api/articles/:article_id
app.get('/api/articles/:article_id', getArticleByID);
app.patch('/api/articles/:article_id', patchArticleByID);

// '/api/articles/:article_id/comments
app.get('/api/articles/:article_id/comments', getCommentsByID);
app.post('/api/articles/:article_id/comments', postCommentByArticleID);
app.delete('/api/comments/:comment_id', deleteCommentByID)

app.all('/*', (req, res, next) => { 
    res.status(404).send({msg: 'path not found'});
})

app.use(handleCustomErrors);
app.use(handlePsqLErrors);
app.use(handle500Errors);

module.exports = app;
const { getAllTopics } = require('./controllers/topics-controller');
const { getAllUsers } = require('./controllers/users-controller');
const { getArticleByID, patchArticleByID } = require('./controllers/articles-controller');
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






// Task 5 - 'PATCH /api/articles/:article_id
app.patch('/api/articles/:article_id', patchArticleByID);

app.all('/*', (req, res, next) => { 
    res.status(404).send({msg: 'path not found'});
})

// Handle Custom Errors
app.use((err, req, res, next) => {
    if(err.status && err.msg) {
        res.status(err.status).send(err.msg);
    }
    else {
        next(err);
    }
})

// Handle PSQL Errors
app.use((err, req, res, next) => {
    if(err.code === '22P02') {
      res.status(400).send('Invalid Data Type');
    } 
    else {
        next(err);
    }
})

// Handle 500s
app.use((err, req, res, next) => {
    console.log(err, '<<<')
    // console.log('App.js 500 Error', err);
    res.status(500).send({msg: 'Internal Server Error - We will look into this'})
})

module.exports = app;
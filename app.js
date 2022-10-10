const { getAllTopics } = require('./controllers/topics-controller');
const { getArticleByID } = require('./controllers/articles-controller');
const express = require('express');
const app = express();

app.use(express.json());

// Task 2 - 'GET /api/topics'
app.get('/api/topics', getAllTopics);

// Task 3 - 'GET /api/articles/:article_id'
app.get('/api/articles/:article_id', getArticleByID);


app.all('/*', (req, res, next) => { 
    res.status(404).send({msg: 'path not found'});
})

app.use((err, req, res, next) => {
    if(err.status && err.msg) {
        res.status(err.status).send(err.msg);
    }
    else {
        next(err);
    }
})

app.use((err, req, res, next) => {
    console.log('App.js Error', err);
    res.status(500).send({msg: 'Internal Server Error - We will look into this'})
})

module.exports = app;
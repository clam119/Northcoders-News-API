const { getAllTopics } = require('./controllers/topics-controller');
const express = require('express');
const app = express();

app.use(express.json());

// Task 2 - 'GET /api/topics'
app.get('/api/topics', getAllTopics);

app.use((err, req, res, next) => {
    if(!err.status && err.msg) {
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
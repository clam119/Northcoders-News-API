const { getAvailableEndpoints } = require('./controllers/api-controller');
const { handleCustomErrors, handlePsqLErrors, handle500Errors } = require('./errors');
const express = require('express');
const app = express();
const apiRouter = require('./routes/api-router');

app.use(express.json());
app.use('/api', apiRouter);

// '/api'
app.get('/api', getAvailableEndpoints);

app.all('/*', (req, res, next) => { 
    res.status(404).send({msg: 'path not found'});
})

app.use(handleCustomErrors);
app.use(handlePsqLErrors);
app.use(handle500Errors);

module.exports = app;
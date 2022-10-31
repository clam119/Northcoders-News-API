const { getAvailableEndpoints } = require('./controllers/api-controller');
const { handleCustomErrors, handlePsqLErrors, handle500Errors } = require('./errors');
const express = require('express');
const app = express();
const apiRouter = require('./routes/api-router');
const path = require('path');
const cors = require('cors');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public', 'build')));
app.use(cors());

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'build', 'public', 'index.html'));
});

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
exports.handleCustomErrors = (err, req, res, next) => {
    if(err.status && err.msg) {
        res.status(err.status).send(err.msg);
    }
    else {
        next(err);
    }
}

exports.handlePsqLErrors = (err, req, res, next) => {
    if(err.code === '22P02') {
      res.status(400).send('Invalid Data Type');
    } 

    if (err.code === '23502') {
        res.status(400).send('Bad Request');
    }

    if(err.code === '23503') {
        res.status(404).send('Article not found')
    }
    else {
        next(err);
    }
}

exports.handle500Errors = (err, req, res, next) => {
    res.status(500).send({msg: 'Internal Server Error - We will look into this'})
}


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

    else {
        next(err);
    }
}

exports.handle500Errors = (err, req, res, next) => {
    console.log('A custom 500 Error has occurred, check in errors.js', err);
    res.status(500).send({msg: 'Internal Server Error - We will look into this'})
}


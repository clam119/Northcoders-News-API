const apiRouter = require('express').Router();
const userRouter = require('./users-router');
const topicsRouter  = require('./topics-router');
const articlesRouter = require('./articles-router');
const commentsRouter = require('./comments-router');

apiRouter.get('/', (req, res) => {
    res.status(200).send('All OK from API Router');
})

apiRouter.use('/users', userRouter);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);

module.exports = apiRouter;
const { fetchArticleByID } = require('../models/articles-model');

exports.getArticleByID = (req, res, next) => {
    const { article_id } = req.params;
    
    fetchArticleByID(article_id)

    .then((articleData) => {
        res.status(200).send({articleData});
    })

    .catch((err) => {
        next(err);
    })
}
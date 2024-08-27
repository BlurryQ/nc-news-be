const { selectArticleByID } = require("../models/articles.models");

exports.getArticleByID = (request, response, next) => {
  const { article_id } = request.params;
  selectArticleByID(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

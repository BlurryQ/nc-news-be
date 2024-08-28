const { checkIDExists } = require("../db/utility/checkIDExists");
const {
  selectArticles,
  selectArticleByID,
  selectArticleComments,
  insertArticleComment,
} = require("../models/articles.models");

exports.getArticles = (request, response) => {
  selectArticles().then((articles) => {
    response.status(200).send({ articles });
  });
};

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

exports.getArticleComments = (request, response, next) => {
  const { article_id } = request.params;
  selectArticleComments(article_id)
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postArticleComment = (request, response, next) => {
  const { article_id } = request.params;
  const { username, body } = request.body;
  const unresolvedPromises = [
    checkIDExists("articles", "article_id", article_id),
    insertArticleComment(article_id, username, body),
  ];
  if (typeof body !== "string")
    unresolvedPromises.push(
      Promise.reject({ status: 400, msg: "bad request" })
    );
  Promise.all(unresolvedPromises)
    .then(([exists, comment]) => {
      response.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

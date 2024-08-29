const { checkIDExists } = require("../db/utility/checkIDExists");
const {
  selectArticles,
  selectArticleByID,
  selectArticleComments,
  insertArticleComment,
  updateArticleVoteCount,
} = require("../models/articles.models");

exports.getArticles = (request, response, next) => {
  const { sort_by, order } = request.query;
  selectArticles(sort_by, order)
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch((err) => next(err));
};

exports.getArticleByID = (request, response, next) => {
  const { article_id } = request.params;
  selectArticleByID(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => next(err));
};

exports.getArticleComments = (request, response, next) => {
  const { article_id } = request.params;
  const unresolvedPromises = [
    checkIDExists("articles", "article_id", article_id),
    selectArticleComments(article_id),
  ];
  Promise.all(unresolvedPromises)
    .then(([exists, comments]) => {
      response.status(200).send({ comments });
    })
    .catch((err) => next(err));
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
    .catch((err) => next(err));
};

exports.patchArticleVoteCount = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes } = request.body;
  const unresolvedPromises = [
    checkIDExists("articles", "article_id", article_id),
    updateArticleVoteCount(article_id, inc_votes),
  ];
  if (typeof inc_votes !== "number" || isNaN(inc_votes))
    unresolvedPromises.push(
      Promise.reject({ status: 400, msg: "bad request" })
    );
  Promise.all(unresolvedPromises)
    .then(([exists, article]) => {
      response.status(200).send({ article });
    })
    .catch((err) => next(err));
};

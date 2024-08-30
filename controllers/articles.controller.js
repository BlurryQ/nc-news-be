const {
  getAllTopics,
  checkIDExists,
  isArticleDataValid,
} = require("../utilities");
const {
  selectArticles,
  selectArticleByID,
  selectArticleComments,
  insertArticle,
  insertArticleComment,
  updateArticleVoteCount,
} = require("../models/articles.models");

exports.getArticles = (request, response, next) => {
  const { sort_by, order, topic } = request.query;
  const unresolvedPromises = [
    getAllTopics(),
    selectArticles(sort_by, order, topic),
  ];

  Promise.all(unresolvedPromises)
    .then(([topics, articles]) => {
      if (topic !== undefined && !topics.includes(topic))
        return Promise.reject({ status: 404, msg: "not found" });
      response.status(200).send({ articles });
    })
    .catch((err) => next(err));
};

exports.getArticleByID = (request, response, next) => {
  const { article_id } = request.params;
  const unresolvedPromises = [
    checkIDExists("articles", "article_id", article_id),
    selectArticleByID(article_id),
  ];
  Promise.all(unresolvedPromises)
    .then(([exists, article]) => {
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

exports.postArticle = (request, response, next) => {
  const newArticle = request.body;
  if (!newArticle.article_img_url)
    newArticle.article_img_url =
      "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700";
  const isArticleValid = isArticleDataValid(newArticle);
  const unresolvedPromises = [insertArticle(newArticle)];
  if (!isArticleValid)
    unresolvedPromises.push(
      Promise.reject({ status: 400, msg: "bad request" })
    );
  Promise.all(unresolvedPromises)
    .then(([article]) => {
      article.comment_count = 0;
      response.status(201).send({ article });
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
      response.status(201).send({ comment });
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

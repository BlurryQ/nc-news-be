const {
  getAllTopics,
  checkIDExists,
  isArticleDataValid,
  pagination,
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
  const { sort_by, order, topic, page, limit } = request.query;
  const unresolvedPromises = [
    getAllTopics(),
    selectArticles(sort_by, order, topic),
    page,
    limit,
  ];
  Promise.all(unresolvedPromises)
    .then(([topics, articles, page = 1, limit = articles.length]) => {
      if (topic !== undefined && !topics.includes(topic))
        return Promise.reject({ status: 404, msg: "not found" });

      const maxPages = Math.ceil(articles.length / limit);
      page = Number(page);
      limit = Number(limit);
      if (
        page > maxPages ||
        typeof page != "number" ||
        typeof limit !== "number" ||
        isNaN(page) ||
        isNaN(limit)
      ) {
        next({ status: 400, msg: "bad request" });
      }
      const result = limit
        ? pagination(limit, page, articles, "articles", response)
        : articles;
      response.status(200).send(result);
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
    selectArticleComments(article_id),
    checkIDExists("articles", "article_id", article_id),
  ];
  Promise.all(unresolvedPromises)
    .then(([comments]) => {
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
    insertArticleComment(article_id, username, body),
    checkIDExists("articles", "article_id", article_id),
  ];
  if (typeof body !== "string")
    unresolvedPromises.push(
      Promise.reject({ status: 400, msg: "bad request" })
    );
  Promise.all(unresolvedPromises)
    .then(([comment]) => {
      response.status(201).send({ comment });
    })
    .catch((err) => next(err));
};

exports.patchArticleVoteCount = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes } = request.body;
  const unresolvedPromises = [
    updateArticleVoteCount(article_id, inc_votes),
    checkIDExists("articles", "article_id", article_id),
  ];
  if (typeof inc_votes !== "number" || isNaN(inc_votes))
    unresolvedPromises.push(
      Promise.reject({ status: 400, msg: "bad request" })
    );
  Promise.all(unresolvedPromises)
    .then(([article]) => {
      response.status(200).send({ article });
    })
    .catch((err) => next(err));
};

const { getAPIEndpoints } = require("./api.controller");

const { getTopics } = require("./topics.controllers");

const {
  getArticles,
  getArticleByID,
  getArticleComments,
  postArticleComment,
  patchArticleVoteCount,
} = require("./articles.controller");

const { removeCommentByID } = require("./comments.controller");

const {
  ifPsqlBadRequest,
  ifPsqlItemNotFound,
  internalServerError,
} = require("./errors.controller");

module.exports = {
  getAPIEndpoints,
  getTopics,
  getArticles,
  getArticleByID,
  getArticleComments,
  postArticleComment,
  patchArticleVoteCount,
  removeCommentByID,
  ifPsqlBadRequest,
  ifPsqlItemNotFound,
  internalServerError,
};

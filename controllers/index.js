const { getAPIEndpoints } = require("./api.controller");

const { getUsers } = require("./users.controllers");

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
  ifPsqlNotFound,
  ifCustomError,
  internalServerError,
} = require("./errors.controller");

module.exports = {
  getAPIEndpoints,
  getUsers,
  getTopics,
  getArticles,
  getArticleByID,
  getArticleComments,
  postArticleComment,
  patchArticleVoteCount,
  removeCommentByID,
  ifPsqlBadRequest,
  ifPsqlNotFound,
  ifCustomError,
  internalServerError,
};

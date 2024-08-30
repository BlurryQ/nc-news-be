const { getAPIEndpoints } = require("./api.controller");

const { getUsers, getUserByUsername } = require("./users.controllers");

const { getTopics } = require("./topics.controllers");

const {
  getArticles,
  getArticleByID,
  getArticleComments,
  postArticleComment,
  patchArticleVoteCount,
} = require("./articles.controller");

const {
  removeCommentByID,
  patchCommentVoteCount,
} = require("./comments.controller");

const {
  ifPsqlError,
  ifCustomError,
  internalServerError,
} = require("./errors.controller");

module.exports = {
  getAPIEndpoints,
  getUsers,
  getUserByUsername,
  getTopics,
  getArticles,
  getArticleByID,
  getArticleComments,
  postArticleComment,
  patchArticleVoteCount,
  removeCommentByID,
  patchCommentVoteCount,
  ifPsqlError,
  ifCustomError,
  internalServerError,
};

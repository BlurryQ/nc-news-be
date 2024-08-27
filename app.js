const express = require("express");
const { getAPIEndpoints } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/topics.controllers");
const {
  getArticles,
  getArticleByID,
} = require("./controllers/articles.controller");
const {
  ifPsqlBadRequest,
  ifPsqlItemNotFound,
  internalServerError,
} = require("./controllers/errors.controller");

const app = express();

app.get("/api", getAPIEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleByID);

app.use(ifPsqlBadRequest);

app.use(ifPsqlItemNotFound);

app.use(internalServerError);

module.exports = app;

const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { getAPIEndpoints } = require("./controllers/api.controller");
const { getArticleByID } = require("./controllers/articles.controller");
const {
  ifPsqlBadRequest,
  ifPsqlItemNotFound,
  internalServerError,
} = require("./controllers/errors.controller");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api", getAPIEndpoints);

app.get("/api/articles/:article_id", getArticleByID);

app.use(ifPsqlBadRequest);

app.use(ifPsqlItemNotFound);

app.use(internalServerError);

module.exports = app;

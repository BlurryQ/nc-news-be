const {
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
} = require("./controllers/index");
const express = require("express");

const app = express();
app.use(express.json());

app.get("/api", getAPIEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleByID);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postArticleComment);

app.patch("/api/articles/:article_id", patchArticleVoteCount);

app.delete("/api/comments/:comment_id", removeCommentByID);

app.use(ifPsqlBadRequest);

app.use(ifPsqlItemNotFound);

app.use(internalServerError);

module.exports = app;

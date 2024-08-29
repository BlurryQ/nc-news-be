const {
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
} = require("./controllers/index");
const express = require("express");

const app = express();
app.use(express.json());

app.get("/api", getAPIEndpoints);

app.get("/api/users", getUsers);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleByID);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postArticleComment);

app.patch("/api/articles/:article_id", patchArticleVoteCount);

app.delete("/api/comments/:comment_id", removeCommentByID);

app.use(ifPsqlBadRequest);

app.use(ifPsqlNotFound);

app.use(ifCustomError);

app.use(internalServerError);

module.exports = app;

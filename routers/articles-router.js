const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleByID,
  getArticleComments,
  postArticle,
  postArticleComment,
  patchArticleVoteCount,
} = require("../controllers");

articlesRouter.get("/", getArticles);

articlesRouter.get("/:article_id", getArticleByID);

articlesRouter.get("/:article_id/comments", getArticleComments);

articlesRouter.post("/", postArticle);

articlesRouter.post("/:article_id/comment", postArticleComment);

articlesRouter.patch("/:article_id", patchArticleVoteCount);

module.exports = { articlesRouter };

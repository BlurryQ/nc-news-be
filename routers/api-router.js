const apiRouter = require("express").Router();
const { getAPIEndpoints } = require("../controllers");
const {
  usersRouter,
  topicsRouter,
  articlesRouter,
  commentsRouter,
} = require("./");

apiRouter.get("/", getAPIEndpoints);

apiRouter.use("/users", usersRouter);

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/comments", commentsRouter);

module.exports = { apiRouter };

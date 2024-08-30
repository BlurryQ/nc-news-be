const commentsRouter = require("express").Router();
const { removeCommentByID } = require("../controllers");

commentsRouter.delete("/:comment_id", removeCommentByID);

module.exports = { commentsRouter };

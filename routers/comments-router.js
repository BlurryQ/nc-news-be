const commentsRouter = require("express").Router();
const { removeCommentByID, patchCommentVoteCount } = require("../controllers");

commentsRouter.patch("/:comment_id", patchCommentVoteCount);

commentsRouter.delete("/:comment_id", removeCommentByID);

module.exports = { commentsRouter };

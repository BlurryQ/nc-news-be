const { deleteCommentByID } = require("../models/comments.model");
const { checkIDExists } = require("../db/utility/checkIDExists");

exports.removeCommentByID = (request, response, next) => {
  const { comment_id } = request.params;
  const unresolvedPromises = [
    checkIDExists("comments", "comment_id", comment_id),
    deleteCommentByID(comment_id),
  ];
  Promise.all(unresolvedPromises)
    .then(() => {
      response.status(204).send();
    })
    .catch((err) => next(err));
};

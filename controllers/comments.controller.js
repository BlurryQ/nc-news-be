const {
  deleteCommentByID,
  updateCommentVoteCount,
} = require("../models/comments.model");
const { checkIDExists } = require("../utilities");

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

exports.patchCommentVoteCount = (request, response, next) => {
  const { comment_id } = request.params;
  const { inc_votes } = request.body;
  const unresolvedPromises = [
    updateCommentVoteCount(comment_id, inc_votes),
    checkIDExists("comments", "comment_id", comment_id),
  ];
  if (typeof inc_votes !== "number" || isNaN(inc_votes))
    unresolvedPromises.push(
      Promise.reject({ status: 400, msg: "bad request" })
    );
  Promise.all(unresolvedPromises)
    .then(([comment]) => {
      response.status(200).send({ comment });
    })
    .catch((err) => next(err));
};

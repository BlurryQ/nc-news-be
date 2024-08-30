const db = require("../db/connection");

exports.deleteCommentByID = (commentID) => {
  return db
    .query(
      `delete from comments
            where comment_id = $1
            returning *`,
      [commentID]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateCommentVoteCount = (commentID, votesAdjust) => {
  return db
    .query(
      `update comments
        set votes = votes + $1
        where comment_id = $2
        returning *`,
      [votesAdjust, commentID]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

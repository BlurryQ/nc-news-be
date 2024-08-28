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

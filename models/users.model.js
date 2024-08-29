const db = require("../db/connection");

exports.selectUsers = () => {
  return db
    .query(
      `select * from users
        order by username asc`
    )
    .then(({ rows }) => {
      return rows;
    });
};

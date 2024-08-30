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

exports.selectUserByUsername = (username) => {
  return db
    .query(
      `select * from users
    where username = $1`,
      [username]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

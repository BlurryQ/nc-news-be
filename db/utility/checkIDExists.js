const db = require("../connection");
const format = require("pg-format");

exports.checkIDExists = (tableName, columnName, ID) => {
  const formattedQuery = format(
    `select * from %I
       where %I = $1`,
    tableName,
    columnName
  );
  return db
    .query(formattedQuery, [ID])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return rows[0];
    })
    .catch((err) => {
      if (err && err.msg)
        return Promise.reject({ status: err.status, msg: err.msg });
      return Promise.reject({ status: 400, msg: "bad request" });
    });
};

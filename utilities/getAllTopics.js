const db = require("../db/connection");

exports.getAllTopics = () => {
  return db.query(`select slug from topics`).then(({ rows }) => {
    return rows.map((row) => row.slug);
  });
};

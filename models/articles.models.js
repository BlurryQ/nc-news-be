const db = require("../db/connection");
const format = require("pg-format");

exports.selectArticles = () => {
  return db
    .query(
      `select articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, count(comments.article_id) as comment_count from articles
    left join comments on articles.article_id = comments.article_id
    group by articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url
    order by articles.created_at desc
`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectArticleByID = (article_id) => {
  return db
    .query(
      `select * from articles
        where article_id = $1`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({ status: 404, msg: "not found" });
      return rows[0];
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

exports.selectArticleComments = (article_id) => {
  return db
    .query(
      `select * from comments
      where article_id = $1
      order by created_at desc`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({ status: 404, msg: "not found" });
      return rows;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

exports.insertArticleComment = (article_id, username, comment) => {
  const formattedQuery = format(
    `insert into comments (
    body,
    author, 
    article_id, 
    votes)
    values
    (%L)
    returning *`,
    [comment, username, article_id, 0]
  );
  return db
    .query(formattedQuery)
    .then(({ rows }) => {
      return rows[0];
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

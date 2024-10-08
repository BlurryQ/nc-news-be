const db = require("../db/connection");
const format = require("pg-format");

exports.selectArticles = (sort_by = "created_at", order = "desc", topic) => {
  let formattedQuery = `select articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, count(comments.article_id) as comment_count from articles
  left join comments on articles.article_id = comments.article_id
  `;

  const parameterArr = [];
  if (topic) {
    formattedQuery += `where articles.topic = $1
  `;
    parameterArr.push(topic);
  }

  formattedQuery = format(
    formattedQuery +
      `group by articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url
  order by %I `,
    sort_by
  );

  const validOrder = ["asc", "desc"];
  order = order.toLowerCase();

  if (!validOrder.includes(order))
    return Promise.reject({ status: 400, msg: "bad request" });

  formattedQuery += order;

  return db.query(formattedQuery, parameterArr).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleByID = (article_id) => {
  return db
    .query(
      `select articles.*, count(comments.article_id) as comment_count from articles
      left join comments on articles.article_id = comments.article_id
      where articles.article_id = $1
      group by articles.article_id`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows[0];
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
      return rows;
    });
};

exports.insertArticle = (newArticle) => {
  const formattedQuery = format(
    `insert into articles (
    author, title, body, topic, article_img_url)
    values
    (%L)
    returning *`,
    [
      newArticle.author,
      newArticle.title,
      newArticle.body,
      newArticle.topic,
      newArticle.article_img_url,
    ]
  );
  return db.query(formattedQuery).then(({ rows }) => {
    return rows[0];
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
  return db.query(formattedQuery).then(({ rows }) => {
    return rows[0];
  });
};

exports.updateArticleVoteCount = (articleID, votesAdjust) => {
  return db
    .query(
      `update articles
        set votes = votes + $1
        where article_id = $2
        returning *`,
      [votesAdjust, articleID]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

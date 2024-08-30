exports.isArticleDataValid = (article) => {
  if (typeof article.author !== "string" || !article.author) return false;
  if (typeof article.title !== "string" || !article.title) return false;
  if (typeof article.body !== "string" || !article.body) return false;
  if (typeof article.topic !== "string" || !article.topic) return false;
  return true;
};

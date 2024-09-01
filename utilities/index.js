const { checkIDExists } = require("./checkIDExists");
const { getAllTopics } = require("./getAllTopics");
const { isArticleDataValid } = require("./isArticleDataValid");
const { pagination } = require("./pagination");

module.exports = {
  getAllTopics,
  checkIDExists,
  isArticleDataValid,
  pagination,
};

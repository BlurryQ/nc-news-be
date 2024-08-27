const { selectTopics } = require("../models/topics.models");

exports.getTopics = (request, response) => {
  selectTopics().then((topics) => {
    response.status(200).send({ topics });
  });
};

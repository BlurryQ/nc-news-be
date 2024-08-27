const endpoints = require("../endpoints.json");

exports.getAPIEndpoints = (request, response) => {
  response.status(200).send({ endpoints });
};

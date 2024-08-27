const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { getAPIEndpoints } = require("./controllers/api.controller");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api", getAPIEndpoints);

app.use((err, request, response, next) => {
  response.status(500).send({ msg: "internal server error" });
});

module.exports = app;

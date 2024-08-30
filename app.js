const {
  ifPsqlError,
  ifCustomError,
  internalServerError,
} = require("./controllers/");
const express = require("express");
const { apiRouter } = require("./routers/api-router");

const app = express();
app.use(express.json());

app.use("/api", apiRouter);

app.use(ifPsqlError);

app.use(ifCustomError);

app.use(internalServerError);

module.exports = app;

exports.ifPsqlBadRequest = (err, request, response, next) => {
  if (err.code === "22P02" || err.code === "42703")
    response.status(400).send({ msg: "bad request" });
  next(err);
};

exports.ifPsqlNotFound = (err, request, response, next) => {
  if (err.code === "23503") response.status(404).send({ msg: "not found" });
  next(err);
};

exports.ifCustomError = (err, request, response, next) => {
  if (err && err.msg) response.status(err.status).send({ msg: err.msg });
  next(err);
};

exports.internalServerError = (err, request, response, next) => {
  response.status(500).send({ msg: "internal server error" });
};

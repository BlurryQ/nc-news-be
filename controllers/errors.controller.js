exports.ifPsqlBadRequest = (err, request, response, next) => {
  if (err.code === "22P02") response.status(400).send({ msg: "bad request" });
  next(err);
};

exports.ifPsqlItemNotFound = (err, request, response, next) => {
  if (err && err.msg) response.status(err.status).send({ msg: err.msg });
  next(err);
};

exports.internalServerError = (err, request, response, next) => {
  response.status(500).send({ msg: "internal server error" });
};

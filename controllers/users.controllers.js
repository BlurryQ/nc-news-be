const { response } = require("../app");
const { selectUsers, selectUserByUsername } = require("../models/users.model");
const { checkIDExists } = require("../utilities");

exports.getUsers = (request, response) => {
  selectUsers().then((users) => {
    response.status(200).send({ users });
  });
};

exports.getUserByUsername = (request, response, next) => {
  const { username } = request.params;
  const unresolvedPromises = [
    checkIDExists("users", "username", username),
    selectUserByUsername(username),
  ];
  Promise.all(unresolvedPromises)
    .then(([exists, user]) => {
      response.status(200).send({ user });
    })
    .catch((err) => next(err));
};

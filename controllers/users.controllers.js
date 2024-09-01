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
    selectUserByUsername(username),
    checkIDExists("users", "username", username),
  ];
  Promise.all(unresolvedPromises)
    .then(([user]) => {
      response.status(200).send({ user });
    })
    .catch((err) => next(err));
};

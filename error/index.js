const CustomAPIError = require("./custom-error");
const UnauthenticatedError = require("./unauthenticate");
const BadRequest = require("./bad-request");
const NotFoundError = require("./not-found");

module.exports = {
  NotFoundError,
  CustomAPIError,
  BadRequest,
  UnauthenticatedError,
};

const User = require("../model/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../error");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return next(new UnauthenticatedError("Auth denied"));
  }
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userID: payload.userId, email: payload.email };
    console.log(payload);
    next();
  } catch (err) {
    throw new UnauthenticatedError("Authentication denied");
  }
};

module.exports = auth;

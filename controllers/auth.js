const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const { UnauthenticatedError, BadRequest } = require("../error");

const register = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: `User already exist` });

  const user = await User.create(req.body);
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    id: user.id,
    email: user.email,
    token,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new BadRequest("Please provide valid credentials");

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "User not found",
    });
  }

  const isCorrectPassword = await user.comparePassword(password);

  if (!isCorrectPassword) {
    throw new UnauthenticatedError("Incorrect password");
  }
  const token = user.createJWT();

  return res.status(StatusCodes.CREATED).json({
    id: user.id,
    email: user.email,
    token,
  });
};

module.exports = { login, register };

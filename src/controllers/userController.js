const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/User.js");

const registerUser = asyncHandler(async (req, res) => {
  res.status(StatusCodes.OK).json({ message: "User Registration endpoint" });
});

module.exports = { registerUser };

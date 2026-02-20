const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User.js");
const { StatusCodes } = require("http-status-codes");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (!req.headers.authorization) {
    res.status(StatusCodes.UNAUTHORIZED);
    throw new Error("No Token found in the header");
  }

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.UNAUTHORIZED);
      throw new Error("Not Authorised, Token Failed");
    }
  }
});

module.exports = { protect };

const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT, {
    expiresIn: "10d",
  });
};

module.exports = generateToken;

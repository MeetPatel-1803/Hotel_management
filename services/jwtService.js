const jwt = require("jsonwebtoken");

const generateJWTToken = (payload, res) => {
  const token = jwt.sign(payload, process.env.JWT_SECRETKEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  return token;
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRETKEY);
};

module.exports = {
  generateJWTToken,
  verifyToken,
};

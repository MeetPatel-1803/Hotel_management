const jwt = require("jsonwebtoken");
const { INCORRECT_TOKEN, TOKEN_NOT_GET, UNAUTHORIZED } = require("../message");
const { errorResponseData } = require("../utils/response");
const { verifyToken } = require("../utils/JWTToken");

const isAuthenticatedUser = (req, res, next) => {
  if (!req.headers.authorization) {
    return errorResponseData(res, UNAUTHORIZED, 401);
  }
  const authToken = req.headers.authorization.split(" ");
  const token = authToken[1];

  if (!token) {
    return errorResponseData(res, TOKEN_NOT_GET, 401);
  }

  const decodedToken = verifyToken(token);

  if (!decodedToken) {
    return errorResponseData(res, INCORRECT_TOKEN, 498);
  } else {
    req.id = decodedToken.id;
  }

  next();
};

module.exports = { isAuthenticatedUser };

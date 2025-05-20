const jwt = require("jsonwebtoken");
const {
  INCORRECT_TOKEN,
  TOKEN_NOT_FOUND,
  UNAUTHORIZED_USER,
} = require("../utils/message");
const {
  errorResponseData,
  errorResponseWithoutData,
} = require("../utils/response");
const { META_CODE, STATUS_CODE } = require("../utils/constant");
const { verifyToken } = require("../services/jwtService");

const isAuthenticatedUser = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return errorResponseWithoutData(
        res,
        UNAUTHORIZED_USER,
        META_CODE.FAIL,
        STATUS_CODE.UNAUTHORIZED
      );
    }
    const authToken = req.headers.authorization.split(" ");
    const token = authToken[1];

    if (!token) {
      return errorResponseWithoutData(
        res,
        TOKEN_NOT_FOUND,
        META_CODE.FAIL,
        STATUS_CODE.UNAUTHORIZED
      );
    }

    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      return errorResponseWithoutData(
        res,
        INCORRECT_TOKEN,
        META_CODE.FAIL,
        STATUS_CODE.INVALID_TOKEN
      );
    } else {
      req.id = decodedToken.id;
    }
  } catch (error) {
    return errorResponseWithoutData(res, error.message);
  }

  next();
};

module.exports = { isAuthenticatedUser };

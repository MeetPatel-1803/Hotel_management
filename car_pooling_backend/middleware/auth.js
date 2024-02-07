const jwt = require("jsonwebtoken");
const { INCORRECT_TOKEN, TOKEN_NOT_GET } = require("../message");
const { errorResponseData } = require("../utils/response");

exports.isAuthenticatedUser = (req, res, next) => {
  const authToken = req.headers.authorization.split(" ");
  const token = authToken[1];

  if (!token) {
    return errorResponseData(res, TOKEN_NOT_GET, 401);
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRETKEY);

  if (!decodedToken) {
    return errorResponseData(res, INCORRECT_TOKEN, 498);
  } else {
    req.id = decodedToken.id;
    req.token = token;
  }

  next();
};

const jwt = require("jsonwebtoken");
// const JWT_SECRETKEY = "GGBEJKGBERJIGGWJKUI5789Y589ERSGFHTG";

const jwtTokens = (id, res) => {
  const token = jwt.sign({ id: id }, process.env.JWT_SECRETKEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(200, token, options).json({
    id,
    meta: {
      message: " LogIn Successfully",
      token,
    },
  });
};

module.exports = jwtTokens;

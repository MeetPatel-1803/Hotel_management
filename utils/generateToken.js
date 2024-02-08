const jwt = require("jsonwebtoken");
const Profile = require("../models/userProfile");

module.exports = {
  /**
   * This function will generate a JWT Token.
   * @param {*} id
   * @param {*} res
   */
  jwtTokens(id, res) {
    const token = jwt.sign({ id: id }, process.env.JWT_SECRETKEY, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };

    return { token, options };
  },

  /**
   * @description This function will verify jwt token.
   * @param {*} token 
   * @returns 
   */
  jwtVerify(token) {
    return jwt.verify(token, process.env.JWT_SECRETKEY);
  }
};

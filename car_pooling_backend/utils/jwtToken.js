const jwt = require("jsonwebtoken");
const Profile = require("../models/userProfile");

/**
 * This function will generate a JWT Token.
 * @param {*} id
 * @param {*} res
 */

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

  const profileData = async () => {
    const profile = await Profile.findOne({
      where: {
        user_id: user.id,
      },
    });
    console.log(profile);
  };
  return { token, options, profileData };
};

module.exports = jwtTokens;

const registrationValidation = require("../validations/registrationValidation");
const User = require("../models/user");
const loginValidation = require("../validations/loginValidation");
const { generateJWTToken } = require("../utils/JWTToken");
const bcrypt = require("bcrypt");
const { randomTokens } = require("../utils/helper");
const passwordValidation = require("../validations/passwordValidation");
const nodemailer = require("nodemailer");
const {
  responseSuccessWithMessage,
  errorResponseData,
  errorResponseWithoutData,
  successResponseWithoutData,
} = require("../utils/response");
const {
  USER_REGISTERED,
  EMAIL_ALREADY_TAKEN,
  UNAUTHORIZED_USER,
  INCORRECT_PASSWORD,
  INCORRECT_MAIL,
  INCORRECT_TOKEN,
  PASSWORD_UPDATED,
  TOKEN_EXPIRED,
  LOGIN_SUCCESSFUL,
} = require("../utils/message");
const Profile = require("../models/userProfile");

/**
 * @description It will register a user and validate its credentials.
 * @param {*} req
 * @param {*} res
 */

const registerUser = async (req, res) => {
  const reqParams = req.body;
  registrationValidation(reqParams, res, async (validate) => {
    if (validate) {
      const user = await User.findOne({
        where: {
          email: reqParams.email,
        },
      });
      if (!user) {
        bcrypt.hash(reqParams.password, 10, async (err, hash) => {
          if (err) {
            errorResponseData(res, err.message, 500);
          } else {
            const user = await User.create({
              email: reqParams.email,
              password: hash,
              country_code: reqParams.country_code,
              mobile_no: reqParams.mobile_no,
            });
            responseSuccessWithMessage(res, user, USER_REGISTERED);
          }
        });
      } else {
        errorResponseData(res, EMAIL_ALREADY_TAKEN, 409);
      }
    }
  });
};

/**
 * @description It will verify a user for login and validate its credentials.
 * @param {*} req
 * @param {*} res
 */

const logInUser = async (req, res) => {
  const reqParams = req.body;
  loginValidation(reqParams, res, async (validate) => {
    if (validate) {
      const user = await User.findOne({
        where: {
          email: reqParams.email,
        },
      });

      if (!user) {
        return errorResponseData(res, UNAUTHORIZED_USER, 401);
      } else {
        const profile = await Profile.findOne({
          where: {
            user_id: user.id,
          },
        });

        bcrypt.compare(reqParams.password, user.password, (err, isValid) => {
          if (err) {
            return errorResponseWithoutData(res, err);
          } else if (!isValid) {
            return errorResponseData(res, INCORRECT_PASSWORD, 400);
          } else {
            const tokenData = generateJWTToken(user.id, res);

            if (profile) {
              responseSuccessWithMessage(
                res,
                { isProfileCreated: true, token: tokenData.token },
                LOGIN_SUCCESSFUL
              );
            } else {
              responseSuccessWithMessage(
                res,
                { isProfileCreated: false, token: tokenData.token },
                LOGIN_SUCCESSFUL
              );
            }
          }
        });
      }
    }
  });
};

/**
 * @description It will authencticate a user and pass email for reset password
 * @param {*} req
 * @param {*} res
 * @returns
 */
const forgotPassword = async (req, res) => {
  const reqParams = req.body;

  const user = await User.findOne({
    where: {
      email: reqParams.email,
    },
  });

  if (user) {
    const token = randomTokens(2);
    const d = new Date();
    const tokenExpire = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getMinutes() + 1,
      d.getSeconds(),
      d.getMilliseconds()
    );

    const setToken = await User.update(
      { Token: token, token_expire: tokenExpire },
      { where: { email: reqParams.email } }
    );

    if (!setToken) {
      return errorResponseData(res, INCORRECT_MAIL, 498);
    } else {
      const resetPasswordUrl = `http://${process.env.FRONTEND_URL}/reset-password?tokenId=${token}`;

      const transporter = nodemailer.createTransport({
        host: process.env.HOST_SERVICE,
        port: process.env.SERVICE_PORT,
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      });
      try {
        await transporter.sendMail({
          from: process.env.MAIL_USER,
          to: reqParams.email,
          subject: "RESET PASSWORD",
          html: `${resetPasswordUrl}`,
        });
      } catch (error) {
        errorResponseWithoutData(res, error);
      }

      responseSuccessWithMessage(res, resetPasswordUrl, token);
    }
  } else {
    errorResponseData(res, INCORRECT_MAIL, 409);
  }
};

/**
 * @description It will reset password and validate password
 * @param {*} req
 * @param {*} res
 */

const resetPassword = async (req, res) => {
  const reqParams = req.body;
  const token = reqParams.token;
  const d = new Date();

  passwordValidation(reqParams, res, async (validate) => {
    if (validate) {
      const user = await User.findOne({
        where: {
          Token: token,
        },
      });

      if (user && user.token_expire < d) {
        return errorResponseWithoutData(res, TOKEN_EXPIRED, 401);
      } else {
        if (user) {
          bcrypt.hash(reqParams.password, 10, async (err, hash) => {
            if (err) {
              return errorResponseWithoutData(res, err);
            } else {
              const setData = await User.update(
                { password: hash, Token: null, token_expire: null },
                { where: { Token: token } }
              );
              if (!setData) {
                errorResponseData(res, INCORRECT_TOKEN, 498);
              } else {
                successResponseWithoutData(res, PASSWORD_UPDATED);
              }
            }
          });
        } else {
          errorResponseData(res, INCORRECT_TOKEN, 498);
        }
      }
    }
  });
};

module.exports = {
  registerUser,
  logInUser,
  forgotPassword,
  resetPassword,
};

const { User } = require("../models");
const sendResetEmail = require("../services/emailService.js");
const { generateJWTToken } = require("../services/jwtService");
const { META_CODE, STATUS_CODE } = require("../utils/constant");
const { randomTokens } = require("../utils/helper.js");
const {
  EMAIL_ALREADY_TAKEN,
  UNAUTHORIZED_USER,
  USER_REGISTERED,
  INCORRECT_PASSWORD,
  LOGIN_SUCCESSFUL,
  INCORRECT_MAIL,
  RESET_LINK_SET_SUCCESSFULLY,
  MAIL_NOT_REGISTERED,
  TOKEN_EXPIRED,
  INCORRECT_TOKEN,
  PASSWORD_UPDATED,
} = require("../utils/message");
const {
  errorResponseWithoutData,
  responseSuccessWithMessage,
  successResponseWithoutData,
} = require("../utils/response");
const {
  registrationValidation,
  loginValidation,
  passwordValidation,
} = require("../validations/authValidations");
const { config } = require("dotenv");

config();

const register = async (req, res) => {
  const reqParam = req.body;
  registrationValidation(reqParam, res, async (validate) => {
    if (validate) {
      const userDetail = await user.findOne({
        where: {
          email: reqParam.email,
        },
      });
      if (!userDetail) {
        bcrypt.hash(reqParam.password, 10, async (err, hash) => {
          if (err) {
            return errorResponseWithoutData(
              res,
              err.message,
              META_CODE.FAIL,
              STATUS_CODE.INTERNAL_SERVER_ERROR
            );
          } else {
            const userData = await user.create({
              email: reqParam.email,
              password: hash,
              phone_no: reqParam.phone_no,
              role: reqParam.role,
            });
            return responseSuccessWithMessage(
              res,
              userData,
              USER_REGISTERED,
              META_CODE.SUCCESS
            );
          }
        });
      } else {
        return errorResponseWithoutData(
          res,
          EMAIL_ALREADY_TAKEN,
          META_CODE.FAIL
        );
      }
    }
  });
};

const login = async (req, res) => {
  const reqParam = req.body;
  loginValidation(reqParam, res, async (validate) => {
    if (validate) {
      const userDetail = await User.findOne({
        where: {
          email: reqParam.email,
        },
      });

      if (!userDetail) {
        return errorResponseWithoutData(
          res,
          UNAUTHORIZED_USER,
          META_CODE.FAIL,
          STATUS_CODE.UNAUTHORIZED
        );
      } else {
        bcrypt.compare(
          reqParam.password,
          userDetail.password,
          (err, isValid) => {
            if (err) {
              return errorResponseWithoutData(res, err, META_CODE.FAIL);
            } else if (!isValid) {
              return errorResponseWithoutData(
                res,
                INCORRECT_PASSWORD,
                META_CODE.FAIL,
                STATUS_CODE.BAD_REQUEST
              );
            } else {
              const token = generateJWTToken(
                {
                  id: userDetail.id,
                  email: userDetail.email,
                  role: userDetail.role,
                },
                res
              );

              return responseSuccessWithMessage(
                res,
                { userDetail, token: token },
                LOGIN_SUCCESSFUL,
                META_CODE.SUCCESS
              );
            }
          }
        );
      }
    }
  });
};

const forgotPassword = async (req, res) => {
  const reqParam = req.body;

  const userDetail = await User.findOne({
    where: {
      email: reqParam.email,
    },
  });

  if (userDetail) {
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
      { where: { email: reqParam.email } }
    );

    if (!setToken) {
      return errorResponseWithoutData(
        res,
        INCORRECT_MAIL,
        META_CODE.FAIL,
        STATUS_CODE.INVALID_TOKEN
      );
    } else {
      const resetPasswordUrl = `http://${process.env.FRONTEND_URL}/reset-password?tokenId=${token}`;

      sendResetEmail(reqParam.email, resetPasswordUrl);

      // const transporter = nodemailer.createTransport({
      //   host: process.env.HOST_SERVICE,
      //   port: process.env.SERVICE_PORT,
      //   secure: false,
      //   auth: {
      //     user: process.env.MAIL_USER,
      //     pass: process.env.MAIL_PASSWORD,
      //   },
      // });
      // try {
      //   await transporter.sendMail({
      //     from: process.env.MAIL_USER,
      //     to: reqParam.email,
      //     subject: "RESET PASSWORD",
      //     html: `${resetPasswordUrl}`,
      //   });
      // } catch (error) {
      //   errorResponseWithoutData(res, error);
      // }

      return responseSuccessWithMessage(
        res,
        { resetPasswordUrl, token },
        RESET_LINK_SET_SUCCESSFULLY,
        META_CODE.SUCCESS
      );
    }
  } else {
    return errorResponseWithoutData(
      res,
      MAIL_NOT_REGISTERED,
      META_CODE.FAIL,
      STATUS_CODE.CONFLICT
    );
  }
};

const resetPassword = async (req, res) => {
  const reqParam = req.body;
  const token = reqParam.token;

  passwordValidation(reqParam, res, async (validate) => {
    if (validate) {
      const userDetail = await User.findOne({
        where: {
          Token: token,
        },
      });

      if (userDetail && userDetail.token_expire < new Date()) {
        return errorResponseWithoutData(
          res,
          TOKEN_EXPIRED,
          META_CODE.FAIL,
          STATUS_CODE.UNAUTHORIZED
        );
      } else {
        if (userDetail) {
          bcrypt.hash(reqParam.password, 10, async (err, hash) => {
            if (err) {
              return errorResponseWithoutData(res, err, META_CODE.FAIL);
            } else {
              const setData = await User.update(
                { password: hash, Token: null, token_expire: null },
                { where: { Token: token } }
              );
              if (!setData) {
                return errorResponseWithoutData(
                  res,
                  INCORRECT_TOKEN,
                  META_CODE.FAIL,
                  STATUS_CODE.INVALID_TOKEN
                );
              } else {
                return successResponseWithoutData(
                  res,
                  PASSWORD_UPDATED,
                  META_CODE.SUCCESS
                );
              }
            }
          });
        } else {
          return errorResponseWithoutData(
            res,
            INCORRECT_TOKEN,
            META_CODE.FAIL,
            STATUS_CODE.INVALID_TOKEN
          );
        }
      }
    }
  });
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};

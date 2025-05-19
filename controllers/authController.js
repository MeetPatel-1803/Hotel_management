const { User } = require("../models");
const { META_CODE, STATUS_CODE } = require("../utils/constant");
const {
  EMAIL_ALREADY_TAKEN,
  UNAUTHORIZED_USER,
  USER_REGISTERED,
} = require("../utils/message");
const {
  errorResponseWithoutData,
  responseSuccessWithMessage,
} = require("../utils/response");
const {
  registrationValidation,
  loginValidation,
} = require("../validations/authValidations");

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
      const userDetail = await user.findOne({
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
        const profileData = await User.findOne({
          where: {
            user_id: userDetail.id,
          },
        });

        bcrypt.compare(
          reqParam.password,
          userDetail.password,
          (err, isValid) => {
            if (err) {
              return errorResponseWithoutData(res, err);
            } else if (!isValid) {
              return errorResponseData(res, INCORRECT_PASSWORD, 400);
            } else {
              const token = generateJWTToken(userDetail.id, res);

              if (profileData) {
                responseSuccessWithMessage(
                  res,
                  { isProfileCreated: true, token: token },
                  LOGIN_SUCCESSFUL
                );
              } else {
                responseSuccessWithMessage(
                  res,
                  { isProfileCreated: false, token: token },
                  LOGIN_SUCCESSFUL
                );
              }
            }
          }
        );
      }
    }
  });
};

const forgotPassword = async (req, res) => {
  const reqParam = req.body;

  const userDetail = await user.findOne({
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

    const setToken = await user.update(
      { Token: token, token_expire: tokenExpire },
      { where: { email: reqParam.email } }
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
          to: reqParam.email,
          subject: "RESET PASSWORD",
          html: `${resetPasswordUrl}`,
        });
      } catch (error) {
        errorResponseWithoutData(res, error);
      }

      responseSuccessWithMessage(res, resetPasswordUrl, token);
    }
  } else {
    errorResponseData(res, MAIL_NOT_REGISTERED, 409);
  }
};

const resetPassword = async (req, res) => {
  const reqParam = req.body;
  const token = reqParam.token;

  passwordValidation(reqParam, res, async (validate) => {
    if (validate) {
      const userDetail = await user.findOne({
        where: {
          Token: token,
        },
      });

      if (userDetail && userDetail.token_expire < new Date()) {
        return errorResponseWithoutData(res, TOKEN_EXPIRED, 401);
      } else {
        if (userDetail) {
          bcrypt.hash(reqParam.password, 10, async (err, hash) => {
            if (err) {
              return errorResponseWithoutData(res, err);
            } else {
              const setData = await user.update(
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
  register,
  login,
  forgotPassword,
  resetPassword,
};

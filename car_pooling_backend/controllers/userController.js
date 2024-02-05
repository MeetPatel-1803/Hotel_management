const registrationValidation = require("../middleware/registrationValidation");
const User = require("../models/userModel");
const loginValidation = require("../middleware/loginValidation");
const jwtTokens = require("../utils/jwtToken");
const bcrypt = require("bcrypt");
const errorHandler = require("../utils/errorHandler");
const randomTokens = require("../utils/randomToken");
const passwordValidation = require("../middleware/passwordValidation");
const nodemailer = require("nodemailer");

let token;

exports.registerUser = async (req, res) => {
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
            return errorHandler(err.message, 500, res);
          } else {
            const user = await User.create({
              email: reqParams.email,
              password: hash,
              country_code: reqParams.country_code,
              mobile_no: reqParams.mobile_no,
            });

            return res.status(200).json({
              user,
              message: "User Registered Successfully",
            });
          }
        });
      } else {
        return errorHandler("Email is already taken", 409, res);
      }
    }
  });
};

exports.logInUser = async (req, res) => {
  const reqParams = req.body;
  loginValidation(reqParams, res, async (validate) => {
    if (validate) {
      const user = await User.findOne({
        where: {
          email: reqParams.email,
        },
      });
      if (!user) {
        return errorHandler("Unauthorized - User not found", 401, res);
      } else {
        bcrypt.compare(reqParams.password, user.password, (err, isValid) => {
          if (err) {
            return errorHandler(err, 401, res);
          } else if (!isValid) {
            return errorHandler("Incorrect password", 400, res);
          } else {
            jwtTokens(user.id, res);
          }
        });
      }
    }
  });
};

exports.forgotPassword = async (req, res) => {
  const reqParams = req.body;

  const user = await User.findOne({
    where: {
      email: reqParams.email,
    },
  });

  if (user) {
    const token = randomTokens(2);
    console.log(token, ">>>>>>>>>>>>>>>");
    const setToken = await User.update(
      { Token: token },
      { where: { email: reqParams.email } }
    );

    if (!setToken) {
      return errorHandler("token invalid", 498, res);
    } else {
      // const resetPasswordUrl = `${req.protocol}://${req.get(
      //   "host"
      // )}/api/v1/password/reset?${token}`;

      const resetPasswordUrl = `http://192.168.1.182:5173/resetpassword?tokenId=${token}`;

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "20it102@charusat.edu.in",
          pass: "@1803#Meet",
        },
        tls: {
          ciphers: "SSLv3",
        },
      });
      console.log(reqParams.email);
      try {
        await transporter.sendMail({
          from: "20it102@charusat.edu.in",
          to: reqParams.email,
          subject: "RESET PASSWORD",
          html: `${resetPasswordUrl}`,
        });
        console.log("mail info ???");
      } catch (error) {
        console.log(error, "??????????");
      }

      return res.end(
        JSON.stringify({
          meta: {
            message: `${resetPasswordUrl}`,
            token: `${token}`,
          },
        })
      );
    }
  } else {
    return errorHandler("Invalid Email", 409, res);
  }
};

exports.resetPasswordToken = (req, res) => {
  token = req.params.token;
  console.log(token, "???????????????");
};

exports.resetPassword = async (req, res) => {
  const reqParams = req.body;
  passwordValidation(reqParams, res, async (validate) => {
    if (validate) {
      console.log(token, "TTTTTTTTTTTTTTTTTTTT");
      const user = await User.findOne({
        where: {
          Token: token,
        },
      });
      console.log(user);
      if (user) {
        bcrypt.hash(reqParams.password, 10, async (err, hash) => {
          if (err) {
            return errorHandler(err, 500, res);
          } else {
            const setData = await User.update(
              { password: hash, Token: null },
              { where: { Token: token } }
            );
            if (!setData) {
              return errorHandler("Something Went Wrong", 500, res);
            } else {
              return res.status(200).json({
                message: "password update successfully",
              });
            }
          }
        });
      } else {
        return errorHandler("Invalid Token", 500, res);
      }
    }
  });
};

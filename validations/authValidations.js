const Joi = require("joi");
const { errorResponseData } = require("../utils/response");

const registrationValidation = (req, res, callback) => {
  const schema = Joi.object({
    name: Joi.string().trim(true).required(true),
    email: Joi.string()
      .email()
      .trim(true)
      .required()
      .pattern(/[a-zA-Z0-9._-]+@[a-zA-Z.-]+\.[a-zA-Z]{2,4}/), // EMAIL DOMAIN VALIDATION
    password: Joi.string()
      .min(6)
      .max(100)
      .trim(true)
      .required()
      .pattern(/(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}/),
    phone_no: Joi.string()
      // .min(3)
      .max(12)
      .required()
      .pattern(/\s*[0-9]{10,11}/),
    role: Joi.string()
      .valid("admin", "user")
      .required()
      .insensitive()
      .trim(true),
  });
  const { error } = schema.validate(req);
  if (error) {
    return errorResponseData(res, error.message, 400);
  } else {
    return callback(true);
  }
};

const loginValidation = (req, res, callback) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .trim(true)
      .required()
      .pattern(/[a-zA-Z0-9._-]+@[a-zA-Z.-]+\.[a-zA-Z]{2,4}/),
    password: Joi.string()
      .min(6)
      .max(100)
      .trim(true)
      .required()
      .pattern(/(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}/),
  });
  const { error } = schema.validate(req);
  if (error) {
    return errorResponseData(res, error.message, 401);
  } else {
    return callback(true);
  }
};

const passwordValidation = (req, res, callback) => {
  const schema = Joi.object({
    password: Joi.string()
      .min(6)
      .max(100)
      .trim(true)
      .required()
      .pattern(/(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}/),

    confirmPassword: Joi.string().required().valid(Joi.ref("password")),
    token: Joi.string(),
  });

  const { error } = schema.validate(req);
  if (error) {
    errorResponseData(res, error.message);
  } else {
    return callback(true);
  }
};

module.exports = {
  registrationValidation,
  loginValidation,
  passwordValidation,
};

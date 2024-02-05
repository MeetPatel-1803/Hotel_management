const Joi = require("joi");
const errorHandler = require("../utils/errorHandler");

const loginValidation = (req, res, callback) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .trim(true) // EMAIL DOMAIN VALIDATION
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
    return errorHandler(error.message, 401, res);
  } else {
    return callback(true);
  }
};
module.exports = loginValidation;

const Joi = require("joi");
const errorHandler = require("../utils/errorHandler");

const passwordValidation = (req, res, callback) => {
  const schema = Joi.object({
    password: Joi.string()
      .min(6)
      .max(100)
      .trim(true)
      .required()
      .pattern(/(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}/),

    confirmPassword: Joi.string().required().valid(Joi.ref("password")),
  });

  const { error } = schema.validate(req);
  if (error) {
    return errorHandler(error.message, 401, res);
  } else {
    return callback(true);
  }
};

module.exports = passwordValidation;

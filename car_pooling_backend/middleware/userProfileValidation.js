const Joi = require("joi");
const errorHandler = require("../utils/errorHandler");

const profileValidation = (req, res, callback) => {
  const schema = Joi.object({
    first_name: Joi.string().trim(true),
    last_name: Joi.string().trim(true),
    bio: Joi.string(),
    address: Joi.string(),
    gender: Joi.string().valid("male", "female").insensitive(),
    date_of_birth: Joi.date(), // ----------- DATE VALIDATION -------------
  });

  const { error } = schema.validate(req);
  if (error) {
    console.log(error);
    return errorHandler(error.message, 401, res);
  } else {
    return callback(true);
  }
};
module.exports = profileValidation;

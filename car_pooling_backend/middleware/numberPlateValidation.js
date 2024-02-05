const Joi = require("joi");
const errorHandler = require("../utils/errorHandler");

const numberPlateValidation = (req, res, callback) => {
  const schema = Joi.object({
    number: Joi.string()
      .required()
      .pattern(/[A-Z]{2}[ -]?[0-9]{2}[ -]?[A-Z]{1,2}[ -]?[0-9]{4}/),
  });
  const { error } = schema.validate(req);
  if (error) {
    return errorHandler(error.message, 401, res);
  } else {
    return callback(true);
  }
};
module.exports = numberPlateValidation;

const Joi = require("joi");
const { errorResponseData } = require("../utils/response");

/**
 * @description It will validate number plate 
 * @param {*} req 
 * @param {*} res 
 * @param {*} callback 
 * @returns 
 */

const numberPlateValidation = (req, res, callback) => {
  const schema = Joi.object({
    number: Joi.string()
      .required()
      .pattern(/[A-Z]{2}[ -]?[0-9]{2}[ -]?[A-Z]{1,2}[ -]?[0-9]{4}/),
  });
  const { error } = schema.validate(req);
  if (error) {
    return errorResponseData(res,error.message, 401);
  } else {
    return callback(true);
  }
};
module.exports = numberPlateValidation;

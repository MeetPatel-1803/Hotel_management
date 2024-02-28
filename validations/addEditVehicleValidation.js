const Joi = require("joi");
const { errorResponseData } = require("../utils/response");

/**
 * @description It will validate number plate
 * @param {*} req
 * @param {*} res
 * @param {*} callback
 * @returns
 */

const addEditVehicleValidation = (req, res, callback) => {
  const schema = Joi.object({
    id: Joi.number(),
    updateVehicle: Joi.boolean(),
    name: Joi.string().required(),
    type: Joi.string()
      .valid(
        "SUV",
        "Sedan",
        "Hatchback",
        "Coupe",
        "Van",
        "Compact Sedan",
        "Compact SUV",
        "MUV"
      )
      .trim()
      .insensitive()
      .required(),
    number: Joi.string()
      .required()
      .pattern(/^[A-Z]{2}[ -]?[0-9]{2}[ -]?[A-Z]{1,2}[ -]?[0-9]{4}$/),
    noOfSeats: Joi.number().required(),
  });
  const { error } = schema.validate(req);
  if (error) {
    return errorResponseData(res, error.message, 401);
  } else {
    return callback(true);
  }
};
module.exports = addEditVehicleValidation;

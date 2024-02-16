const Joi = require("joi");
const { errorResponseData } = require("../utils/response");

/**
 * @description It will validate trip attributes
 * @param {*} req
 * @param {*} res
 * @param {*} callback
 * @returns
 */

const filteredRidesValidation = (req, res, callback) => {
  const schema = Joi.object({
    vehicleId: Joi.number().required(),
    sourceAddress: Joi.string().trim().required(),
    sourceLat: Joi.number().min(-90).max(90).precision(2).required(),
    sourceLong: Joi.number().min(-180).max(180).precision(2).required(),
    destAddress: Joi.string().trim().required(),
    destLat: Joi.number().min(-90).max(90).precision(2).required(),
    destLong: Joi.number().min(-180).max(180).precision(2).required(),
    departureDate: Joi.date(),
    departureTime: Joi.string().pattern(/^([01]?[0-9])\:([0-5][0-9])$/i),
    requiredSeats: Joi.number(),
    tripType: Joi.string()
      .valid("single trip", "recurring trip")
      .insensitive(),
  });

  const { error } = schema.validate(req);
  if (error) {
    return errorResponseData(res, error.message, 401);
  } else {
    return callback(true);
  }
};
module.exports = filteredRidesValidation;

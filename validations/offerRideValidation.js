const Joi = require("joi");
const { errorResponseData } = require("../utils/response");

/**
 * @description It will validate trip attributes
 * @param {*} req
 * @param {*} res
 * @param {*} callback
 * @returns
 */

const postRideValidation = (req, res, callback) => {
  const schema = Joi.object({
    vehicle_id: Joi.number(),
    Source_address: Joi.string().required(),
    Source_lat: Joi.number().min(-90).max(90).precision(2).required(),
    Source_long: Joi.number().min(-180).max(180).precision(2).required(),
    dest_address: Joi.string().required(),
    dest_lat: Joi.number().min(-90).max(90).precision(2).required(),
    dest_long: Joi.number().min(-180).max(180).precision(2).required(),
    departure_date: Joi.date(),
    departure_time: Joi.string().pattern(/^([01]?[0-9])\:([0-5][0-9])$/i),
    available_seats: Joi.number().required(),
    fare: Joi.number().min(0).precision(2).required(),
    trip_type: Joi.string()
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
module.exports = postRideValidation;

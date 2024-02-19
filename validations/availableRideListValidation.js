const Joi = require("joi");
const { errorResponseData } = require("../utils/response");
const { PAGINATION, MAX_NO_OF_PASSANGER } = require("../constants/constants");

/**
 * @description It will validate trip attributes
 * @param {*} req
 * @param {*} res
 * @param {*} callback
 * @returns
 */

const availableRideListValidation = (req, res, callback) => {
  const schema = Joi.object({
    page: Joi.number().allow(""),
    per_page: Joi.number()
      .max(PAGINATION.MAXIMUM_PER_PAGE)
      .allow("")
      .optional(),
    sort_by: Joi.string().allow("").optional(),
    sort_type: Joi.string().valid("ASC", "DESC").optional().allow(""),
    search: Joi.string().allow("").optional(),
    source_address: Joi.string().trim(),
    dest_address: Joi.string().trim(),
    departure_date_from: Joi.date().optional(),
    departure_date_to: Joi.date().optional(),
    departure_time_from: Joi.string().pattern(/^([01]?[0-9])\:([0-5][0-9])$/i),
    departure_time_to: Joi.string().pattern(/^([01]?[0-9])\:([0-5][0-9])$/i),
    no_of_passanger: Joi.number().max(MAX_NO_OF_PASSANGER),
    fare_min: Joi.number().precision(2),
    fare_max: Joi.number().precision(2),
  });

  const { error } = schema.validate(req);
  if (error) {
    return errorResponseData(res, error.message, 401);
  } else {
    return callback(true);
  }
};
module.exports = availableRideListValidation;

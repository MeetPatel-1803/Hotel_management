const Trip = require("../models/trip");
const { AVAILABLE_TRIPS_FETCHED, TOKEN_NOT_FOUND } = require("../utils/message");
const {
  errorResponseData,
  responseSuccessWithMessage,
} = require("../utils/response");
const bookRideValidation = require("../validations/bookRideValidation");

/**
 * @description This function will get available trips from posted trips.
 * @param {*} req
 * @param {*} res
 */

const bookRide = async (req, res) => {
  const reqParams = req.body;

  bookRideValidation(reqParams, res, async (validate) => {
    if (validate) {
      try {
        const availableTrips = await Trip.findAll({
          where: { user_id: req.id },
          attributes: [
            "source_address",
            "dest_address",
            "departure_date",
            "departure_time",
            "available_seats",
            "fare",
          ],
        });

        if (!availableTrips) {
          return errorResponseData(res, TOKEN_NOT_FOUND);
        }
        responseSuccessWithMessage(
          res,
          availableTrips,
          AVAILABLE_TRIPS_FETCHED
        );
      } catch (error) {
        return errorResponseData(res, error);
      }
    }
  });
};

module.exports = bookRide;

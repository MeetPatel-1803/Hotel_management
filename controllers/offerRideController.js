const Trip = require("../models/trip");
const { SOMETHING_WRONG, TRIP_CREATED } = require("../utils/message");
const {
  errorResponseData,
  responseSuccessWithMessage,
} = require("../utils/response");
const offerRideValidation = require("../validations/offerRideValidation");

/**
 * @description This function will create a trip for who want to provide trip.
 * @param {*} req
 * @param {*} res
 */
const offerRide = async (req, res) => {
  try {
    const reqParams = req.body;

    offerRideValidation(reqParams, res, async (validate) => {
      if (validate) {
        const ride = await Trip.create({
          user_id: req.id,
          source_address: reqParams.sourceAddress,
          source_lat: reqParams.sourceLat,
          source_long: reqParams.sourceLong,
          dest_address: reqParams.destAddress,
          dest_lat: reqParams.destLat,
          dest_long: reqParams.destLong,
          departure_date: reqParams.departureDate,
          departure_time: reqParams.departureTime,
          available_seats: reqParams.availableSeats,
          fare: reqParams.fare,
          vehicle_id: reqParams.vehicleId,
        });

        if (!ride) {
          return errorResponseData(res, SOMETHING_WRONG, 500);
        }
        responseSuccessWithMessage(res, ride, TRIP_CREATED);
      }
    });
  } catch (error) {
    return errorResponseData(res, error);
  }
};

module.exports = offerRide;

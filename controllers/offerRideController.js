const Trip = require("../models/trip");
const Vehicle = require("../models/userVehicle");
const { SOMETHING_WRONG, TRIP_CREATED } = require("../utils/message");
const {
  errorResponseData,
  responseSuccessWithMessage,
} = require("../utils/response");
const postRideValidation = require("../validations/postRideValidation");

/**
 * @description This function will create a trip for who want to provide trip.
 * @param {*} req 
 * @param {*} res 
 */

const offerRide = async (req, res) => {
  const reqParams = req.body;

  const vehicleId = await Vehicle.findByPk(req.id);

  postRideValidation(reqParams, res, async (validate) => {
    if (validate) {
      const ride = await Trip.create({
        user_id: req.id,
        source_address: reqParams.Source_address,
        Source_lat: reqParams.Source_lat,
        Source_long: reqParams.Source_long,
        dest_address: reqParams.dest_address,
        dest_lat: reqParams.dest_lat,
        dest_long: reqParams.dest_long,
        departure_date: reqParams.departure_date,
        departure_time: reqParams.departure_time,
        available_seats: reqParams.available_seats,
        fare: reqParams.fare,
        trip_type: reqParams.trip_type,
        vehicle_id: vehicleId.id,
      });

      if (!ride) {
        return errorResponseData(res, SOMETHING_WRONG, 500);
      }
      responseSuccessWithMessage(res, ride, TRIP_CREATED);
    }
  });
};

module.exports = offerRide;

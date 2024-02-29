const { Sequelize } = require("sequelize");
const bookingRequests = require("../models/bookingRequests");
const trip = require("../models/trip");
const {
  BOOKING_REQUEST_CREATED,
  SEATS_ARE_NOT_AVAILABLE,
  RIDE_IS_FULL,
  BOOKING_REQUEST_ACCEPTED,
} = require("../utils/message");
const {
  errorResponseData,
  responseSuccessWithMessage,
} = require("../utils/response");
const addEditRideRequestValidation = require("../validations/addEditRideRequestValidation");
const sequelize = require("../config/database");

/**
 * @description This function will create booking request antry in table & send message to driver.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const addEditRideRequest = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const reqParams = req.body;
    addEditRideRequestValidation(reqParams, res, async (validate) => {
      if (validate) {
        if (reqParams.booking_request_id && reqParams.is_accepted) {
          //review
          const filterCondition = {
            id: reqParams.booking_request_id,
            user_id: reqParams.user_id,
            to_user_id: req.id,
            status: "pending",
            no_of_passanger: reqParams.no_of_passanger,
          };

          const existRequest = await bookingRequests.findOne({
            where: filterCondition,
          });

          if (existRequest) {
            const checkAvailableSeats = await trip.findOne({
              where: { id: reqParams.trip_id },
              attributes: ["available_seats"],
            });

            if (checkAvailableSeats.available_seats == 0) {
              return responseSuccessWithMessage(res, null, RIDE_IS_FULL);
            } else if (
              checkAvailableSeats.available_seats < reqParams.no_of_passanger
            ) {
              return responseSuccessWithMessage(
                res,
                { availableSeats: checkAvailableSeats.available_seats },
                SEATS_ARE_NOT_AVAILABLE
              );
            } else {
              await trip.update(
                {
                  available_seats: Sequelize.literal(
                    `available_seats - ${reqParams.no_of_passanger}`
                  ),
                },
                { where: { id: reqParams.trip_id } }
              );

              await bookingRequests.update(
                { status: "accepted" },
                { where: { id: reqParams.booking_request_id } }
              );

              const currentAvailableSeats = await trip.findOne({
                where: { id: reqParams.trip_id },
                attributes: ["available_seats"],
              });

              await transaction.commit();
              return responseSuccessWithMessage(
                res,
                {
                  currentAvailableSeats: currentAvailableSeats.available_seats,
                },
                BOOKING_REQUEST_ACCEPTED
              );
            }
          }
        } else {
          const tripDetail = await trip.findOne({
            where: { id: reqParams.trip_id },
            attributes: ["user_id"],
          });

          const bookingRequest = await bookingRequests.create({
            trip_id: reqParams.trip_id,
            user_id: req.id, // user who request for a ride
            to_user_id: tripDetail.user_id, // user who create a ride
            no_of_passanger: reqParams.no_of_passanger,
          });

          await transaction.commit();
          return responseSuccessWithMessage(
            res,
            { bookingRequest: bookingRequest },
            BOOKING_REQUEST_CREATED
          );
        }
      }
    });
  } catch (error) {
    await transaction.rollback();
    return errorResponseData(res, error.message);
  }
};
module.exports = addEditRideRequest;

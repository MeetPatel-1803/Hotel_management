const { Sequelize } = require("sequelize");
const bookingRequests = require("../models/bookingRequests");
const trip = require("../models/trip");
const {
  BOOKING_REQUEST_CREATED,
  SEATS_ARE_NOT_AVAILABLE,
  RIDE_IS_FULL,
  CANNOT_UPDATE_A_RIDE,
  RIDE_UPDATED,
} = require("../utils/message");
const {
  errorResponseData,
  responseSuccessWithMessage,
  successResponseWithoutData,
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
        if (reqParams.booking_request_id) {
          const existRequest = await bookingRequests.findOne({
            where: { id: reqParams.booking_request_id, status: "pending" },
          });

          if (!existRequest) {
            return successResponseWithoutData(res, CANNOT_UPDATE_A_RIDE);
          }
        }

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
        }

        await trip.update(
          {
            available_seats: Sequelize.literal(
              `available_seats - ${reqParams.no_of_passanger}`
            ),
          },
          { where: { id: reqParams.trip_id } }
        );

        const currentAvailableSeats = await trip.findOne({
          where: { id: reqParams.trip_id },
          attributes: ["available_seats"],
        });

        if (reqParams.booking_request_id) {
          await bookingRequests.update(
            {
              no_of_passanger: Sequelize.literal(
                `no_of_passanger + ${reqParams.no_of_passanger}`
              ),
            },
            { where: { id: reqParams.booking_request_id } }
          );

          await transaction.commit();
          return responseSuccessWithMessage(
            res,
            {
              currentAvailableSeats: currentAvailableSeats.available_seats,
            },
            RIDE_UPDATED
          );
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
            {
              bookingRequest: bookingRequest,
              currentAvailableSeats: currentAvailableSeats.available_seats,
            },
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

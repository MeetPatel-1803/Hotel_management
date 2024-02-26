const { Op } = require("sequelize");
const moment = require("moment");
const { PAGINATION } = require("../constants/constants");
const Trip = require("../models/trip");
const {
  SOMETHING_WRONG,
  TRIP_CREATED,
  AVAILABLE_TRIPS_FETCHED,
  NO_RIDES_FOUND,
  TRIP_NOT_FOUND,
  CANNOT_EDIT_A_TRIP,
  CANCEL_OFFERED_RIDE,
  TRIP_UPDATED,
  RIDE_CANCEL_CONFIRMATION,
} = require("../utils/message");
const {
  errorResponseData,
  responseSuccessWithMessage,
  successResponseWithoutData,
} = require("../utils/response");
const addEditOfferRideValidation = require("../validations/offerRideValidation");
const availableRideListValidation = require("../validations/availableRideListValidation");
const bookingRequests = require("../models/booking_requests");
const sequelize = require("../config/database");

/**
 * @description This function will create a trip for who want to provide trip.
 * @param {*} req
 * @param {*} res
 */
const addEditOfferRide = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const reqParams = req.body;

    addEditOfferRideValidation(reqParams, res, async (validate) => {
      if (validate) {
        if (reqParams.trip_id && reqParams.editOfferRide) {
          const tripExist = await Trip.findOne({
            where: { id: reqParams.trip_id },
          });

          if (!tripExist) {
            return errorResponseData(res, TRIP_NOT_FOUND);
          }

          const isTripStatusAccepted = await bookingRequests.findAll({
            where: { trip_id: reqParams.trip_id, trip_status: "Accepted" },
            attributes: ["trip_id", "trip_status"],
          });

          if (isTripStatusAccepted.length == 0) {
            const updateCondition = {
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
            };

            await Trip.update(updateCondition, {
              where: { id: reqParams.trip_id },
            });

            const updatedTrip = await Trip.findOne({
              where: { id: reqParams.trip_id },
            });

            await transaction.commit();
            responseSuccessWithMessage(res, updatedTrip, TRIP_UPDATED);
          } else {
            return errorResponseData(res, CANNOT_EDIT_A_TRIP);
          }
        } else if (reqParams.trip_id && reqParams.cancelOfferRide) {
          const tripExist = await Trip.findOne({
            where: { id: reqParams.trip_id },
          });

          if (!tripExist) {
            return errorResponseData(res, TRIP_NOT_FOUND);
          }

          await Trip.destroy({
            where: { id: reqParams.trip_id },
          });

          await transaction.commit();
          successResponseWithoutData(res, CANCEL_OFFERED_RIDE);
        } else {
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

          await transaction.commit();
          responseSuccessWithMessage(res, ride, TRIP_CREATED);
        }
      }
    });
  } catch (error) {
    await transaction.rollback();
    return errorResponseData(res, error.message);
  }
};

/**
 * @description This function is used to get list of created rides.
 * @param {*} req
 * @param {*} res
 * @returns
 */

const availableRidesList = async (req, res) => {
  try {
    const reqParams = req.query;

    availableRideListValidation(reqParams, res, async (validate) => {
      if (validate) {
        const page = reqParams.page
          ? parseInt(reqParams.page)
          : PAGINATION.PAGE;

        const per_page = reqParams.per_page
          ? parseInt(reqParams.per_page)
          : PAGINATION.PER_PAGE;

        const pageItems = (page - 1) * per_page;

        let sortingOrder = [["created_at", "DESC"]];

        if (reqParams.sort_by && reqParams.sort_type) {
          sortingOrder = [[reqParams.sort_by, reqParams.sort_type]];
        }

        const listOfRides = await Trip.findAndCountAll({
          where: {
            ...(reqParams.source_address && {
              source_address: reqParams.source_address,
            }),
            ...(reqParams.dest_address && {
              dest_address: reqParams.dest_address,
            }),
            ...(reqParams.departure_date_from && reqParams.departure_date_to
              ? {
                  departure_date: {
                    [Op.gte]: reqParams.departure_date_from,
                    [Op.lte]: reqParams.departure_date_to,
                  },
                }
              : {
                  departure_date: {
                    [Op.gte]: moment(new Date()).format("YYYY-MM-DD"),
                  },
                }),
            ...(reqParams.departure_time_from && reqParams.departure_time_to
              ? {
                  departure_time: {
                    [Op.gte]: reqParams.departure_time_from,
                    [Op.lte]: reqParams.departure_time_to,
                  },
                }
              : {
                  departure_time: {
                    [Op.gte]: moment(new Date()).format("HH:MM:SS"),
                  },
                }),
            ...(reqParams.no_of_passanger
              ? {
                  available_seats: {
                    [Op.gte]: parseInt(reqParams.no_of_passanger),
                  },
                }
              : { available_seats: { [Op.gte]: 1 } }),
            ...(reqParams.fare_min && reqParams.fare_max
              ? {
                  fare: {
                    [Op.gte]: reqParams.fare_min,
                    [Op.lte]: reqParams.fare_max,
                  },
                }
              : { fare: { [Op.gte]: 0, [Op.lte]: 500 } }),
          },
          order: sortingOrder,
          limit: per_page,
          offset: pageItems,
        });

        if (listOfRides.length == null) {
          return responseSuccessWithMessage(res, listOfRides, NO_RIDES_FOUND);
        }

        return responseSuccessWithMessage(
          res,
          listOfRides.rows,
          AVAILABLE_TRIPS_FETCHED,
          1,
          page,
          per_page,
          { totalCount: listOfRides.count }
        );
      }
    });
  } catch (error) {
    return errorResponseData(res, error.message, 0);
  }
};

module.exports = { addEditOfferRide, availableRidesList };

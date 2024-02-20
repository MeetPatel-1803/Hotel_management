const { Op } = require("sequelize");
const moment = require("moment");
const { PAGINATION } = require("../constants/constants");
const Trip = require("../models/trip");
const {
  SOMETHING_WRONG,
  TRIP_CREATED,
  AVAILABLE_TRIPS_FETCHED,
  NO_RIDES_FOUND,
} = require("../utils/message");
const {
  errorResponseData,
  responseSuccessWithMessage,
} = require("../utils/response");
const offerRideValidation = require("../validations/offerRideValidation");
const availableRideListValidation = require("../validations/availableRideListValidation");

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
                    [Op.eq]: parseInt(reqParams.no_of_passanger),
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

module.exports = { offerRide, availableRidesList };

const { Op } = require("sequelize");
const Trip = require("../models/trip");
const filteredRidesValidation = require("../validations/filteredRideValidation");
const { responseSuccessWithMessage } = require("../utils/response");
const { AVAILABLE_TRIPS_FETCHED } = require("../utils/message");

const filteredRides = async (req, res) => {
  const reqParams = req.body;

  filteredRidesValidation(reqParams, res, async (validate) => {
    if (validate) {
      const availableRides = await Trip.findAll({
        where: {
          user_id: { [Op.ne]: req.id },
          Source_lat: reqParams.Source_lat,
          Source_long: reqParams.Source_long,
          dest_lat: reqParams.dest_lat,
          dest_long: reqParams.dest_long,
        },
      });

      return responseSuccessWithMessage(
        res,
        { availableRides: availableRides },
        AVAILABLE_TRIPS_FETCHED
      );
    }
  });
};

const allRides = async (req, res) => {
  const reqParams = req.body;

  if (reqParams.length == null) {
    const availableRides = await Trip.findAll({
      where: {
        user_id: { [Op.ne]: req.id },
      },
      order: [
        ["source_address", "ASC"],
        ["dest_address", "ASC"],
      ],
    });
    
    return responseSuccessWithMessage(
      res,
      { availableRides: availableRides },
      AVAILABLE_TRIPS_FETCHED
    );
  }
};
module.exports = { filteredRides, allRides };

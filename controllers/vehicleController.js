const numberPlateValidation = require("../validations/numberPlateValidation");
const Vehicle = require("../models/userVehicle");
const { VEHICLE_ADDED } = require("../message");
const {
  responseSuccessWithMessage,
  errorResponseData,
} = require("../utils/response");
const sequelize = require("../config/database");
const Profile = require("../models/userProfile");

const addVehicle = async (req, res) => {
  const reqParams = req.body;

  numberPlateValidation(reqParams, res, async (validate) => {
    if (validate) {
      const transaction = await sequelize.transaction();
      try {
        const vehicle = await Vehicle.create({
          user_id: req.id,
          name: reqParams.name,
          type: reqParams.type,
          number: reqParams.number,
          no_of_seats: reqParams.no_of_seats,
        });

        const id = await Profile.update(
          { vehicle_id: vehicle.id },
          { where: { user_id: req.id } }
        );

        await transaction.commit();

        responseSuccessWithMessage(res, vehicle, VEHICLE_ADDED);
      } catch (error) {
        await transaction.rollback();
        return errorResponseData(res, error.errors[0].message, 400);
      }
    }
  });
};

module.exports = addVehicle;

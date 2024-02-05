const numberPlateValidation = require("../middleware/numberPlateValidation");
const userVehicleModel = require("../models/userVehicleModel");

exports.addVehicle = async (req, res) => {
  const reqParams = req.body;
  numberPlateValidation(reqParams.number, res, async (validate) => {
    if (validate) {
      const userVehicle = await userVehicleModel.create({
        name: reqParams.name,
        type: reqParams.type,
        number: reqParams.number,
        // images
        no_of_seats: reqParams.no_of_seats,
      });

       res.status(200).json({
        userVehicle,
        message: "Vehicle added ",
      });
    }
  });
};

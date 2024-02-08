const numberPlateValidation = require("../validations/numberPlateValidation");
const Vehicle = require("../models/userVehicle");
const { VEHICLE_ADDED, IMAGE_UPLOADED } = require("../utils/message");
const {
  responseSuccessWithMessage,
  errorResponseData,
} = require("../utils/response");
const sequelize = require("../config/database");
const Profile = require("../models/userProfile");
const { randomDigits } = require("../utils/helper");
const generatePreSignedUrl = require("../utils/s3Bucket");

/**
 * @description This function will store information about user vehicle.
 * @param {*} req
 * @param {*} res
 */
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

/**
 * @description This function will upload image of user vehicle on s3 bucket.
 * @param {*} req
 * @param {*} res
 */
const userVehiclePicture = async (req, res) => {
  const imageFile = req.headers.mimetype;
  const imgExtension = imageFile.split("/")[1];
  const fileName = `${Date.now()}${randomDigits(4)}.${imgExtension}`;
  const key = `${process.env.FILE_PATH_VEHICLE}/${fileName}`;
  const expiresIn = 600;

  const url = generatePreSignedUrl(process.env.AWS_BUCKET_NAME, key, expiresIn);

  responseSuccessWithMessage(res, { Image_url: url }, IMAGE_UPLOADED);
};

module.exports = { addVehicle, userVehiclePicture };

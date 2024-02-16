const numberPlateValidation = require("../validations/numberPlateValidation");
const Vehicle = require("../models/userVehicle");
const {
  VEHICLE_ADDED,
  IMAGE_UPLOADED,
  VEHICLE_UPDATED,
  VEHICLE_NOT_FOUND,
  VEHICLE_IMAGE_NOT_FOUND,
  VEHICLES_FETCHED_SUCCESSFULLY,
} = require("../utils/message");
const {
  responseSuccessWithMessage,
  errorResponseData,
} = require("../utils/response");
const sequelize = require("../config/database");
const { randomDigits } = require("../utils/helper");
const { generatePreSignedUrl, removeOldImage } = require("../utils/s3Bucket");
const imageValidation = require("../validations/imageValidation");

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

        await transaction.commit();

        responseSuccessWithMessage(res, vehicle, VEHICLE_ADDED);
      } catch (error) {
        await transaction.rollback();
        return errorResponseData(res, error.message, 400);
      }
    }
  });
};

/**
 * @description This function will update vehicle information.
 * @param {*} req
 * @param {*} res
 */
const updateVehicleInfo = async (req, res) => {
  const reqParams = req.body;

  numberPlateValidation(reqParams, res, async (validate) => {
    if (validate) {
      const transaction = await sequelize.transaction();
      try {
        const vehicle = await Vehicle.update(
          {
            name: reqParams.name,
            type: reqParams.type,
            number: reqParams.number,
            no_of_seats: reqParams.no_of_seats,
          },
          { where: { number: reqParams.number } }
        );

        await transaction.commit();

        responseSuccessWithMessage(res, vehicle, VEHICLE_UPDATED);
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
const addVehiclePicture = async (req, res) => {
  const reqParams = req.body;
  try {
    imageValidation(reqParams, res, async (validate) => {
      if (validate) {
        const imgExtension = reqParams.mimetype.split("/")[1];
        const imgFileName = reqParams.mimetype.split("/")[0];
        const fileName = `${Date.now()}${randomDigits(
          4
        )}-${imgFileName}.${imgExtension}`;
        const key = `${process.env.FILE_PATH_VEHICLE}/${fileName}`;
        const expiresIn = 600;

        const vehicleImage = await Vehicle.update(
          {
            images: fileName,
          },
          { where: { id: reqParams.id } }
        );

        if (!vehicleImage) {
          return errorResponseData(res, VEHICLE_NOT_FOUND, 400);
        }

        const url = generatePreSignedUrl(
          process.env.AWS_BUCKET_NAME,
          key,
          expiresIn
        );

        responseSuccessWithMessage(res, { Image_url: url }, IMAGE_UPLOADED);
      }
    });
  } catch (error) {
    return errorResponseData(res, error, 400);
  }
};

/**
 * @description This function will delete uploaded image from database and s3 Bucket.
 * @param {*} req
 * @param {*} res
 * @returns
 */

const removeVehiclePicture = async (req, res) => {
  const reqParams = req.body;
  try {
    const vehicleImage = await Vehicle.findOne({
      where: { id: reqParams.id },
    });

    if (!vehicleImage) {
      return errorResponseData(res, VEHICLE_IMAGE_NOT_FOUND, 404);
    }

    await Vehicle.update(
      { images: null },
      { where: { images: vehicleImage.images } }
    );

    const file = `${process.env.FILE_PATH_VEHICLE}/${vehicleImage.images}`;
    removeOldImage(process.env.AWS_BUCKET_NAME, file, res);
  } catch (error) {
    return errorResponseData(res, error, 400);
  }
};

/**
 * @description This function will collect all vehicles based on user id.
 * @param {*} req
 * @param {*} res
 */

const getUserVehicles = async (req, res) => {
  try {
    const vehicleCollection = await Vehicle.findAll({
      where: { user_id: req.id },
    });

    responseSuccessWithMessage(
      res,
      { vehicleCollection: vehicleCollection },
      VEHICLES_FETCHED_SUCCESSFULLY
    );
  } catch (error) {
    return errorResponseData(res, error);
  }
};

module.exports = {
  addVehicle,
  updateVehicleInfo,
  addVehiclePicture,
  removeVehiclePicture,
  getUserVehicles,
};

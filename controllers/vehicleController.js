const addEditVehicleValidation = require("../validations/addEditVehicleValidation");
const vehicle = require("../models/userVehicle");
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
 * @description This function will add user vehicle and can update also.
 * @param {*} req
 * @param {*} res
 */
const addEditVehicle = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const reqParams = req.body;

    addEditVehicleValidation(reqParams, res, async (validate) => {
      if (validate) {
        if (reqParams.vehicleId) {
          const vehicleExist = await vehicle.findOne({
            where: { id: reqParams.vehicleId },
          });

          if (!vehicleExist) {
            return errorResponseData(res, VEHICLE_NOT_FOUND);
          }

          const updateCondition = {
            name: reqParams?.name,
            type: reqParams?.type,
            number: reqParams?.number,
            no_of_seats: reqParams?.noOfSeats,
          };

          await vehicle.update(updateCondition, {
            where: { id: reqParams.vehicleId },
          });

          const updatedVehicle = await vehicle.findOne({
            where: { id: reqParams.vehicleId },
          });

          await transaction.commit();
          return responseSuccessWithMessage(
            res,
            { updatedVehicle: updatedVehicle },
            VEHICLE_UPDATED
          );
        } else {
          const setData = await vehicle.create({
            user_id: req.id,
            name: reqParams.name,
            type: reqParams.type,
            number: reqParams.number,
            no_of_seats: reqParams.noOfSeats,
          });

          await transaction.commit();
          return responseSuccessWithMessage(res, setData, VEHICLE_ADDED);
        }
      }
    });
  } catch (error) {
    await transaction.rollback();
    return errorResponseData(res, error.message);
  }
};

/**
 * @description This function will upload image of user vehicle on s3 bucket.
 * @param {*} req
 * @param {*} res
 */
const addEditVehiclePicture = async (req, res) => {
  try {
    const reqParams = req.body;
    imageValidation(reqParams, res, async (validate) => {
      if (validate) {
        const imgExtension = reqParams.mimetype.split("/")[1];
        const imgFileName = reqParams.mimetype.split("/")[0];
        const fileName = `${Date.now()}${randomDigits(
          4
        )}-${imgFileName}.${imgExtension}`;
        const key = `${process.env.FILE_PATH_VEHICLE}/${fileName}`;
        const expiresIn = 600;

        const vehicleImage = await vehicle.update(
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

        return responseSuccessWithMessage(res, { Image_url: url }, IMAGE_UPLOADED);
      }
    });
  } catch (error) {
    return errorResponseData(res, error.message, 400);
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
    const vehicleImage = await vehicle.findOne({
      where: { id: reqParams.id },
    });

    if (!vehicleImage) {
      return errorResponseData(res, VEHICLE_IMAGE_NOT_FOUND, 404);
    }

    await vehicle.update(
      { images: null },
      { where: { images: vehicleImage.images } }
    );

    const file = `${process.env.FILE_PATH_VEHICLE}/${vehicleImage.images}`;
    removeOldImage(process.env.AWS_BUCKET_NAME, file, res);
  } catch (error) {
    return errorResponseData(res, error.message, 400);
  }
};

/**
 * @description This function will collect all vehicles based on user id.
 * @param {*} req
 * @param {*} res
 */

const getUserVehiclesList = async (req, res) => {
  try {
    const vehicleList = await vehicle.findAll({
      where: { user_id: req.id },
    });

    return responseSuccessWithMessage(
      res,
      { vehicleList: vehicleList },
      VEHICLES_FETCHED_SUCCESSFULLY
    );
  } catch (error) {
    return errorResponseData(res, error);
  }
};

module.exports = {
  addEditVehicle,
  addEditVehiclePicture,
  removeVehiclePicture,
  getUserVehiclesList,
};

const {
  createRoomValidation,
  updateRoomValidation,
  deleteRoomValidation,
} = require("../validations/roomValidations");
const sequelize = require("../config/database.js");
const { Room } = require("../models/index.js");
const {
  ROOM_ALREADY_EXIST,
  ROOM_CREATED,
  ROOM_NOT_EXIST,
  ROOM_UPDATED,
  ROOM_DELETED,
} = require("../utils/message.js");
const {
  errorResponseData,
  responseSuccessWithMessage,
  errorResponseWithoutData,
  successResponseWithoutData,
} = require("../utils/response.js");
const { META_CODE, STATUS_CODE } = require("../utils/constant.js");

const createRoom = async (req, res) => {
  try {
    const transaction = await sequelize.transaction();

    const reqParam = req.body;

    await createRoomValidation(reqParam, res, async (validate) => {
      if (validate) {
        const roomDetail = await Room.findOne({
          where: { number: reqParam.number },
        });

        if (roomDetail) {
          return errorResponseData(res, ROOM_ALREADY_EXIST, META_CODE.FAIL);
        } else {
          const room = await Room.create({
            number: reqParam.number,
            type: reqParam.type,
            price: reqParam.price,
            status: reqParam.status,
          });
          // ------ IMAGE FUNCTIONALITY ------

          await transaction.commit();
          return responseSuccessWithMessage(
            res,
            room,
            ROOM_CREATED,
            META_CODE.SUCCESS
          );
        }
      }
    });
  } catch (error) {
    await transaction.rollback();
    return errorResponseData(res, error.message);
  }
};

const updateRoom = async (req, res) => {
  try {
    const transaction = await sequelize.transaction();

    const reqParam = req.body;

    await updateRoomValidation(reqParam, res, async (validate) => {
      if (validate) {
        const roomDetail = await Room.findById(reqParam.roomId);

        if (!roomDetail) {
          return errorResponseWithoutData(
            res,
            ROOM_NOT_EXIST,
            META_CODE.FAIL,
            STATUS_CODE.NOT_FOUND
          );
        } else {
          await Room.update(
            {
              ...(reqParam.number && { number: reqParam.number }),
              ...(reqParam.type && { type: reqParam.type }),
              ...(reqParam.price && { price: reqParam.price }),
              ...(reqParam.status && { status: reqParam.status }),
            },
            {
              where: { id: reqParam.roomId },
            }
          );

          const updatedRoom = await Room.findOne({
            where: { id: reqParam.roomId },
          });

          await transaction.commit();

          return responseSuccessWithMessage(
            res,
            updatedRoom,
            ROOM_UPDATED,
            META_CODE.SUCCESS
          );
        }
      }
    });
  } catch (error) {
    await transaction.rollback();
    return errorResponseData(res, error.message);
  }
};

const deleteRoom = async (req, res) => {
  try {
    const transaction = await sequelize.transaction();

    const reqParam = req.body;

    await deleteRoomValidation(reqParam, res, async (validate) => {
      if (validate) {
        const roomDetail = await Room.findById(reqParam.roomId);

        if (roomDetail) {
          await Room.destroy({ where: { id: reqParam.roomId } });

          await transaction.commit();

          return successResponseWithoutData(
            res,
            ROOM_DELETED,
            META_CODE.SUCCESS
          );
        } else {
          return errorResponseWithoutData(res, ROOM_NOT_EXIST, META_CODE.FAIL);
        }
      }
    });
  } catch (error) {
    await transaction.rollback();
    return errorResponseData(res, error.message);
  }
};

const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll({
      where: { status: ROOM_STATUS.AVAILABLE },
    });

    // pagination

    // sorting
  } catch (error) {
    await transaction.rollback();
    return errorResponseData(res, error.message);
  }
};

module.exports = {
  createRoom,
  updateRoom,
  deleteRoom,
};

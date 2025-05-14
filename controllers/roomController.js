const {
  createRoomValidation,
  updateRoomValidation,
  deleteRoomValidation,
  getAllRoomsValidation,
} = require("../validations/roomValidations.js");
const sequelize = require("../config/database.js");
const { Room } = require("../models/index.js");
const {
  ROOM_ALREADY_EXIST,
  ROOM_CREATED,
  ROOM_NOT_EXIST,
  ROOM_UPDATED,
  ROOM_DELETED,
  ROOMS_NOT_FOUND,
  ROOM_FETCHED,
} = require("../utils/message.js");
const {
  errorResponseData,
  responseSuccessWithMessage,
  errorResponseWithoutData,
  successResponseWithoutData,
} = require("../utils/response.js");
const {
  META_CODE,
  STATUS_CODE,
  PAGINATION,
  ROOM_TYPES,
  ROOM_STATUS,
} = require("../utils/constant.js");
const { Op } = require("sequelize");

const createRoom = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const reqParam = req.body;

    await createRoomValidation(reqParam, res, async (validate) => {
      if (validate) {
        const roomDetail = await Room.findOne({
          where: { number: reqParam.number },
        });

        if (roomDetail) {
          return errorResponseWithoutData(
            res,
            ROOM_ALREADY_EXIST,
            META_CODE.FAIL
          );
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
  const transaction = await sequelize.transaction();
  try {
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

const getRooms = async (req, res) => {
  try {
    const reqParam = req.query;
    await getAllRoomsValidation(reqParam, res, async (validate) => {
      if (validate) {
        if (reqParam.roomId) {
          const roomDetail = await Room.findById(reqParam.roomId);

          if (!roomDetail) {
            return errorResponseWithoutData(
              res,
              ROOM_NOT_EXIST,
              META_CODE.FAIL
            );
          }

          return responseSuccessWithMessage(
            res,
            roomDetail,
            ROOM_FETCHED,
            META_CODE.SUCCESS
          );
        } else {
          const page = reqParam.page
            ? parseInt(reqParam.page)
            : PAGINATION.PAGE;

          const perPage = reqParam.perPage
            ? parseInt(reqParam.perPage)
            : PAGINATION.PER_PAGE;

          const offset = (page - 1) * perPage;

          let sortingOrder = [["created_at", "DESC"]];

          if (reqParam.sortBy && reqParam.sortType) {
            sortingOrder = [[reqParam.sortBy, reqParam.sortType]];
          }

          const rooms = await Room.findAndCountAll({
            where: {
              ...(reqParam.minPrice && { price: { [Op.gte]: reqParam.price } }),
              ...(reqParam.maxPrice && { price: { [Op.lte]: reqParam.price } }),
              ...(reqParam.roomType && { type: reqParam.roomType }),
              status: ROOM_STATUS.AVAILABLE,
            },
            order: sortingOrder,
            limit: perPage,
            offset,
          });

          if (!rooms.rows.length) {
            return errorResponseWithoutData(res, rooms, ROOMS_NOT_FOUND);
          }

          return responseSuccessWithMessage(
            res,
            rooms,
            ROOM_FETCHED,
            META_CODE.SUCCESS,
            { page, perPage, totalCount: listOfRides.count }
          );
        }
      }
    });
  } catch (error) {
    return errorResponseData(res, error.message);
  }
};

module.exports = {
  createRoom,
  updateRoom,
  deleteRoom,
  getRooms,
};

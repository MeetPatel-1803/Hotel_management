const { createRoomValidation } = require("../validations/roomValidations");
const sequelize = require("../config/database.js");
const { Room } = require("../models/index.js");
const { ROOM_ALREADY_EXIST } = require("../utils/message.js");
const { errorResponseData } = require("../utils/response.js");
const { META_CODE } = require("../utils/constant.js");

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
        }
      }
    });
  } catch (error) {
    await transaction.rollback();
    return errorResponseData(res, error.message);
  }
};

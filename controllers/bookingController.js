const { Op } = require("sequelize");
const { bookRoomValidation } = require("../validations/bookingValidations");
const { ROOM_STATUS } = require("../utils/constant");

const bookRoom = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const reqParam = req.body;
    bookRoomValidation(reqParam, res, async (validate) => {
      if (validate) {
        const requestedRooms = reqParam.rooms;

        if (requestedRooms.length) {
          const roomIds = requestedRooms.map((room) => room.roomId);
          const roomDetails = await Room.findAll({
            where: { id: { [Op.in]: roomIds }, status: ROOM_STATUS.AVAILABLE },
          });
          console.log("roomDetails", roomDetails);
          const notAvailableRooms = roomDetails.filter(
            (room) => !roomIds.includes(room.id)
          );
        }
      }
    });
  } catch (error) {
    await transaction.rollback();
    return errorResponseData(res, error.message);
  }
};

module.exports = {
  bookRoom,
};

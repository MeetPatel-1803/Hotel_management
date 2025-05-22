const { Op } = require("sequelize");
const { bookRoomValidation } = require("../validations/bookingValidations");
const { ROOM_STATUS, META_CODE, ROOM_TYPES } = require("../utils/constant");
const sequelize = require("../config/database");
const {
  errorResponseData,
  responseSuccessWithMessage,
} = require("../utils/response");
const { Room } = require("../models");

const bookRoom = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const reqParam = req.body;
    bookRoomValidation(reqParam, res, async (validate) => {
      if (validate) {
        const requestedRooms = reqParam.rooms;

        if (requestedRooms.length) {
          const roomCounts = requestedRooms.reduce((acc, room) => {
            acc = acc + room.noOfRooms;
            return acc;
          }, 0);
          const roomTypes = requestedRooms.map((room) =>
            room.type.toLowerCase()
          );
          let roomDetails = await Room.findAll({
            where: {
              type: { [Op.in]: roomTypes },
              status: ROOM_STATUS.AVAILABLE,
            },
          });
          roomDetails = roomDetails.map((room) => room.get({ plain: true }));

          let bookedRoomDetail = [];
          for (const type of roomTypes) {
            let roomCountPerType = 0;
            switch (type) {
              case ROOM_TYPES.DELUX:
                roomCountPerType = requestedRooms.reduce((acc, room) => {
                  if (room.type === ROOM_TYPES.DELUX) {
                    acc = acc + room.noOfRooms;
                  }
                  return acc;
                }, 0);

                const deluxRooms = roomDetails
                  .filter((room) => room.type === ROOM_TYPES.DELUX)
                  .slice(0, roomCountPerType);

                bookedRoomDetail.push(...deluxRooms);
                break;
              case ROOM_TYPES.SUPER_DELUX:
                roomCountPerType = requestedRooms.reduce((acc, room) => {
                  if (room.Type === ROOM_TYPES.SUPER_DELUX) {
                    acc = acc + room.noOfRooms;
                  }
                  return acc;
                }, 0);

                const superDeluxRooms = roomDetails
                  .filter((room) => room.type === ROOM_TYPES.SUPER_DELUX)
                  .slice(0, roomCountPerType);

                bookedRoomDetail.push(...superDeluxRooms);
                break;
              default:
                break;
            }
          }
          console.log("bookedRoomDetail", bookedRoomDetail);
          if (roomDetails.length !== roomCounts) {
            const notAvailableRooms = roomDetails.filter(
              (room) => !roomTypes.includes(room.type)
            );
            console.log("notAvailableRooms", notAvailableRooms);
          } else {
            // FROM HERE WE CAN REDIRECT TO PAYMENT PAGE & ONCE PAYMENT IS DONE WE CAN UPDATE ROOM AVAILABILITY.
            // BUT FOR NOW SKIP PAYMENT FUNCTIONALITY.

            // console.log("roomDetails", roomDetails);
            const totalPrice = roomDetails.reduce((acc, room) => {
              acc = acc + room.price;
              return acc;
            }, 0);
            const resObj = {
              totalPrice,
            };
            return responseSuccessWithMessage(
              res,
              roomDetails,
              "Room booked",
              META_CODE.SUCCESS
            );
          }
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

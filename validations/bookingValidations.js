const Joi = require("joi");

const bookRoomValidation = (req, res, callback) => {
  const schema = Joi.object({
    checkInDate: Joi.date().required(),
    checkOutDate: Joi.date().required(),
    noOfGuests: Joi.number().min(1).max(10).required(),
    rooms: Joi.array()
      .items(
        Joi.object({
          type: Joi.string()
            .valid(...Object.values(ROOM_TYPES))
            .required(),
          roomId: Joi.number().required(),
        })
      )
      .custom((rooms, helpers) => {
        const roomCounts = rooms.reduce((acc, room) => {
          acc = acc + room.noOfRooms;
          return acc;
        }, 0);

        if (roomCounts >= 5) {
          return helpers.error("any.invalid");
        }

        return rooms;
      }, "Room type validation"),
  });
  const { error } = schema.validate(req);
  if (error) {
    return errorResponseData(res, error.message, 401);
  } else {
    return callback(true);
  }
};

module.exports = {
  bookRoomValidation,
};

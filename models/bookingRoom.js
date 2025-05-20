const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const booking = require("./booking.js");
const room = require("./room.js");

const bookingRoomSchema = sequelize.define("booking_rooms", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  room_id: {
    type: DataTypes.INTEGER,
    references: {
      model: room,
      key: "id",
    },
  },
  booking_id: {
    type: DataTypes.INTEGER,
    references: {
      model: booking,
      key: "id",
    },
  },
  room_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  guests_in_room: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = bookingRoomSchema;

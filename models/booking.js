const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const user = require("./user.js");
const room = require("./room.js");

const bookingSchema = sequelize.define("booking", {
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
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: user,
      key: "id",
    },
  },
  check_in_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  check_out_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  total_price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "pending",
  },
});

module.exports = bookingSchema;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const { ROOM_TYPES, ROOM_STATUS } = require("../utils/constant.js");

const roomSchema = sequelize.define("room", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    values: Object.values(ROOM_TYPES),
    defaultValue: ROOM_TYPES.DELUX,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    values: Object.values(ROOM_STATUS),
    defaultValue: ROOM_STATUS.AVAILABLE,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = roomSchema;

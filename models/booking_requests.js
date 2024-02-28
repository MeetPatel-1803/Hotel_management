const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");
const Trip = require("./trip");

const bookingRequests = sequelize.define("booking_requests", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
  },
  trip_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Trip,
      key: "id",
    },
  },
  to_user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
  },
  no_of_passanger: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  trip_status: {
    type: DataTypes.ENUM,
    values: ["accepted", "rejected", "pending"],
    allowNull: false,
    defaultValue: "pending",
  },
});

module.exports = bookingRequests;

const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./userModel");
const userProfileModel = require("./userProfileModel");

const userVehicleModel = sequelize.define("vehicles", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    References: {
      model: User,
      key: "id",
    },
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  number: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  images: {
    type: DataTypes.BLOB("long"),
    allowNull: false,
  },
  no_of_seats: {
    type: DataTypes.INTEGER(10),
    allowNull: false,
  },
});

// userVehicleModel.belongsTo(userProfileModel, { foreignKey: "vehicle_id" });
// userProfileModel.hasOne(userVehicleModel, { foreignKey: "id" });

module.exports = userVehicleModel;

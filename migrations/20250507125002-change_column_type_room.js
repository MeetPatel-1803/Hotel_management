"use strict";

const { ROOM_TYPES, ROOM_STATUS } = require("../utils/constant");
const { DataTypes } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("room", "type", {
      type: DataTypes.STRING,
      allowNull: false,
      values: Object.values(ROOM_TYPES),
      defaultValue: ROOM_TYPES.DELUX,
    });
    await queryInterface.changeColumn("room", "price", {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.changeColumn("room", "status", {
      type: DataTypes.STRING,
      allowNull: false,
      values: Object.values(ROOM_STATUS),
      defaultValue: ROOM_STATUS.AVAILABLE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("room", "type", {
      type: DataTypes.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn("room", "price", {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.changeColumn("room", "status", {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "available",
    });
  },
};

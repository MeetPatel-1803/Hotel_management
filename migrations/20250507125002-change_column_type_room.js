"use strict";

const { ROOM_TYPES } = require("../utils/constant");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("room", "type", {
      type: DataTypes.ENUM,
      allowNull: false,
      values: Object.values(ROOM_TYPES),
      defaultValue: ROOM_TYPES.DELUX,
    });
    await queryInterface.changeColumn("room", "price", {
      type: DataTypes.DECIMAL,
      allowNull: false,
      values: Object.values(ROOM_TYPES),
      defaultValue: ROOM_TYPES.DELUX,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};

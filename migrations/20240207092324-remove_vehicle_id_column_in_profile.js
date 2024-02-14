"use strict";

const { DataTypes } = require("sequelize");

/**
 * It will remove vehicle_id from profiles and re add if needed.
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.removeColumn("profiles", "vehicle_id");
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.addColumn("profiles", "vehicle_id", {
      type: DataTypes.INTEGER,
      references: {
        model: "vehicles",
        key: "id",
      },
    });
  },
};

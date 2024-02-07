"use strict";
const { DataTypes } = require("sequelize");

/**
 * It will chnage image field type from allownull:false to allownull:true and reset it in vehicle table.
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.changeColumn("vehicles", "images", {
      type: DataTypes.BLOB("long"),
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.changeColumn("vehicles", "images", {
      type: DataTypes.BLOB("long"),
      allowNull: false,
    });
  },
};

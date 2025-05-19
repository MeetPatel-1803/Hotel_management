"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("user", "token", {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn("user", "token_expire", {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("user", "token");
    await queryInterface.removeColumn("user", "token_expire");
  },
};

"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("user", "createdAt", {
      type: DataTypes.DATE,
      allowNull: false,
    });
    await queryInterface.addColumn("user", "updatedAt", {
      type: DataTypes.DATE,
      allowNull: false,
    });
    await queryInterface.addColumn("booking", "createdAt", {
      type: DataTypes.DATE,
      allowNull: false,
    });
    await queryInterface.addColumn("booking", "updatedAt", {
      type: DataTypes.DATE,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("user", "createdAt");
    await queryInterface.removeColumn("user", "updatedAt");
    await queryInterface.removeColumn("booking", "createdAt");
    await queryInterface.removeColumn("booking", "updatedAt");
  },
};

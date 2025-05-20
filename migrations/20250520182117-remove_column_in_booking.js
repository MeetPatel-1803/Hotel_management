"use strict";

const { DataTypes } = require("sequelize");
const room = require("../models/room.js");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("bookings", "room_id");
    await queryInterface.removeColumn("bookings", "status");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("bookings", "room_id", {
      type: DataTypes.INTEGER,
      references: {
        model: room,
        key: "id",
      },
    });
    await queryInterface.addColumn("bookings", "status", {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    });
  },
};

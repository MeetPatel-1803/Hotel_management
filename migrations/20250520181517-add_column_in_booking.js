"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("bookings", "booking_date", {
      type: DataTypes.DATE,
      allowNull: false,
    });
    await queryInterface.addColumn("bookings", "total_rooms_booked", {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn("bookings", "total_guests", {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("bookings", "booking_date");
    await queryInterface.removeColumn("bookings", "total_rooms_booked");
    await queryInterface.removeColumn("bookings", "total_guests");
  },
};

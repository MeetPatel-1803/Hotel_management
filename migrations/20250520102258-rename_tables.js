"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameTable("user", "users");
    await queryInterface.renameTable("booking", "bookings");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameTable("users", "user");
    await queryInterface.renameTable("bookings", "booking");
  },
};

"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameTable("room", "rooms");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameTable("rooms", "room");
  },
};

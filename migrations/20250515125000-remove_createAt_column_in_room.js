"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("rooms", "createdAt");
    await queryInterface.removeColumn("rooms", "updatedAt");
    await queryInterface.renameTable("user", "created_at");
    await queryInterface.renameTable("user", "updated_at");
    await queryInterface.renameTable("booking", "created_at");
    await queryInterface.renameTable("booking", "updated_at");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("rooms", "createdAt");
    await queryInterface.addColumn("rooms", "updatedAt");
    await queryInterface.renameTable("user", "createdAt");
    await queryInterface.renameTable("user", "updatedAt");
    await queryInterface.renameTable("booking", "createdAt");
    await queryInterface.renameTable("booking", "updatedAt");
  },
};

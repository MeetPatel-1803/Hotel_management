"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.renameTable("Users", "users");
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.renameTable("users", "Users");
  },
};

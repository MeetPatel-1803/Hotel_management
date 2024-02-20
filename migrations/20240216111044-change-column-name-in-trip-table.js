"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("trips", "Source_lat", "source_lat");
    await queryInterface.renameColumn("trips", "Source_long", "source_long");
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("trips", "source_lat", "Source_lat");
    await queryInterface.renameColumn("trips", "source_long", "Source_long");
  },
};

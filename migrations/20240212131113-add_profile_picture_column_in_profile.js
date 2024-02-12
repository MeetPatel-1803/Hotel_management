"use strict";

const { DataTypes } = require("sequelize");

module.exports = {

  /**
   * @description It will create profile_picture column in profiles table.
   * @param {*} queryInterface 
   * @param {*} Sequelize 
   * @returns 
   */
  
  async up(queryInterface, Sequelize) {
    return await queryInterface.addColumn("profiles", "profile_picture", {
      type: DataTypes.STRING(60),
      allowNull: true,
      defaultValue: null,
    });
  },

  /**
   * @description It will remove a profile_picture column.
   * @param {*} queryInterface
   * @param {*} Sequelize
   * @returns
   */

  async down(queryInterface, Sequelize) {
    return await queryInterface.removeColumn("profiles", "profile_picture");
  },
};

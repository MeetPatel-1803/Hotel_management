const Sequelize = require("sequelize");
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT,
    define: {
      timestamps: true,
    },
  }
);

module.exports = sequelize;

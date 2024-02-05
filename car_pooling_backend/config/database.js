const Sequelize = require("sequelize");
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
  }
);

try {
  sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .catch((error) => {
      console.error("Unable to connect to the database: ", error);
    });
} catch (error) {
  console.log(error);
}
module.exports = sequelize;

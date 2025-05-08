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
    logging: console.log,
    define: {
      timestamps: true,
    },
  }
);

// try {
//   sequelize
//     .authenticate()
//     .then(() => {
//       console.log("Connection has been established successfully.");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// } catch (error) {
//   console.error("Unable to connect to the database:", error);
// }

module.exports = sequelize;

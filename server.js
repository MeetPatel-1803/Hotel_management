const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./config/database");
const routes = require("./routes/index.js");

dotenv.config();

try {
  sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .catch((err) => {
      console.log(err);
    });
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

const app = express();
app.use(express.json());
app.use("/", routes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

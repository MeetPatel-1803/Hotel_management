const express = require("express");
const app = express();
const dotenv = require("dotenv");
const user = require("./routes/userRoute");
const limiter = require("./middleware/rateLimiter");
const cors = require("cors");

dotenv.config({ path: ".env" });

app.use(express.json());
app.use(cors());
app.use("/api/v1", limiter, user);

app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "*");

  next();
});

const userVehicleModel = require("./models/userVehicleModel");
const userProfileModel = require("./models/userProfileModel");
const User = require("./models/userModel");

User.sync()
  .then(() => {                                 // APPLY MULTIPLE SYNCHRONIZATION USING "sequelize" INSTANCE
    console.log("User table created successfully !");
  })
  .catch((error) => {
    console.log("unable to create table :", error);
  });

userProfileModel
  .sync()
  .then(() => {
    console.log("userProfileModel table created successfully !");
  })
  .catch((error) => {
    console.log("unable to create table :", error);
  });

userVehicleModel
  .sync()
  .then(() => {
    console.log("userVehicleModel table created successfully !");
  })
  .catch((error) => {
    console.log("unable to create table :", error);
  });

app.listen(process.env.PORT, () => {
  console.log(`server is listening on port : ${process.env.PORT}`);
});

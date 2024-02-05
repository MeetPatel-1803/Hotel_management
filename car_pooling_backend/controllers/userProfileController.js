const profileValidation = require("../middleware/userProfileValidation");
const User = require("../models/userModel");
const Sequelize = require("sequelize");
const userProfileModel = require("../models/userProfileModel");

exports.userProfile = async (req, res) => {
  const reqParams = req.body;

  profileValidation(reqParams, res, async (validate) => {
    if (validate) {
      console.log(">>>>>>>>>>>>>>>>>");
      const user = await userProfileModel.create({
        first_name: reqParams.first_name,
        last_name: reqParams.last_name,
        bio: reqParams.bio,
        address: reqParams.address,
        gender: reqParams.gender,
        date_of_birth: reqParams.date_of_birth,
        user_id: userProfileModel.findOne({
          include: [{ model: User, attributes: ["id"] }],
          // include: User,userProfileModel
        }),
      });

      console.log(user, "MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM");

      return res.status(200).json({
        user,
      });
    }
  });
};
// exports.getUserProfile = async (req, res) => {
//   const userProfileInfo = req.body;
//   console.log(userProfileInfo);
// };

// exports.getUserProfilePicture = async (req, res) => {
//   const userProfilePicture = req.body;
// };

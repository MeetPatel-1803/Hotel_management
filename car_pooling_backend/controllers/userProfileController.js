const profileValidation = require("../validations/userProfileValidation");
const User = require("../models/user");
const Sequelize = require("sequelize");
const userProfileModel = require("../models/userProfile");

exports.userProfile = async (req, res) => {
  const reqParams = req.body;

  profileValidation(reqParams, res, async (validate) => {
    if (validate) {
  
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

     

      return res.status(200).json({
        user,
      });
    }
  });
};

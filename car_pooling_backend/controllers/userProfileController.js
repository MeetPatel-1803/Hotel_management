const profileValidation = require("../validations/userProfileValidation");
const User = require("../models/user");
const Profile = require("../models/userProfile");
const Sequelize = require("sequelize");
const { PROFILE_FORM_SUBMITTED, SOMETHING_WRONG } = require("../message");
const {
  responseSuccessWithMessage,
  errorResponseWithoutData,
} = require("../utils/response");

const userProfile = async (req, res) => {
  const profile = Profile.findOne();
};

const userProfileForm = async (req, res) => {
  const reqParams = req.body;

  profileValidation(reqParams, res, async (validate) => {
    if (validate) {
      const setData = await Profile.create({
        user_id: req.id,
        first_name: reqParams.first_name,
        last_name: reqParams.last_name,
        date_of_birth: reqParams.date_of_birth,
        gender: reqParams.gender,
      });

      if (!setData) {
        return errorResponseWithoutData(res, SOMETHING_WRONG);
      } else {
        responseSuccessWithMessage(res, setData, PROFILE_FORM_SUBMITTED);
      }
    }
  });
};

module.exports = { userProfileForm, userProfile };

const profileValidation = require("../validations/userProfileValidation");

const Profile = require("../models/userProfile");

const {
  PROFILE_FORM_SUBMITTED,
  SOMETHING_WRONG,
  USER_PROFILE_FETCHED,
} = require("../message");
const {
  responseSuccessWithMessage,
  errorResponseWithoutData,
} = require("../utils/response");

const userProfile = async (req, res) => {
  const profile = await Profile.findOne({
    where: {
      user_id: req.id,
    },
  });

  responseSuccessWithMessage(res, profile, USER_PROFILE_FETCHED, (code = 1));
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

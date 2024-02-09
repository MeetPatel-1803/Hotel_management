const profileValidation = require("../validations/userProfileValidation");
const Profile = require("../models/userProfile");

const { randomDigits } = require("../utils/helper");

const {
  PROFILE_FORM_SUBMITTED,
  SOMETHING_WRONG,
  USER_PROFILE_FETCHED,
} = require("../message");

const {
  responseSuccessWithMessage,
  errorResponseWithoutData,
} = require("../utils/response");
const generatePreSignedUrl = require("../utils/s3Bucket");

/**
 * @description This function will get the information and update about user profile.
 * @param {*} req
 * @param {*} res
 */
const userProfile = async (req, res) => {
  const profile = await Profile.findOne({
    where: {
      user_id: req.id,
    },
  });

  responseSuccessWithMessage(res, profile, USER_PROFILE_FETCHED, (code = 1));
};

/**
 * @description This function will get information from user.
 * @param {*} req
 * @param {*} res
 */

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

/**
 * @description This function will uplaod a profile picture of user to s3 bucket using presigned url.
 * @param {*} req
 * @param {*} res
 */

const userProfilePicture = async (req, res) => {
  const imageFile = req.headers.mimetype;
  const imgExtension = imageFile.split("/")[1];
  const fileName = `${Date.now()}${randomDigits(4)}.${imgExtension}`;
  const key = `${process.env.FILE_PATH}/${fileName}`;
  const expiresIn = 600;

  const url = generatePreSignedUrl(process.env.AWS_BUCKET_NAME, key, expiresIn);

  res.end(JSON.stringify({ message: imageFile, exe: imgExtension, url: url }));
};

module.exports = { userProfileForm, userProfile, userProfilePicture };

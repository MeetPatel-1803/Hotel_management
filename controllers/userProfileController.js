const profileValidation = require("../validations/userProfileValidation");
const Profile = require("../models/userProfile");
const { randomDigits } = require("../utils/helper");
const {
  PROFILE_FORM_SUBMITTED,
  SOMETHING_WRONG,
  USER_PROFILE_FETCHED,
  PROFILE_NOT_FOUND,
  IMAGE_UPLOADED,
  PROFILE_IMAGE_NOT_FOUND,
} = require("../utils/message");
const {
  responseSuccessWithMessage,
  errorResponseWithoutData,
} = require("../utils/response");
const { generatePreSignedUrl, removeOldImage } = require("../utils/s3Bucket");
const imageValidation = require("../validations/imageValidation");

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
  const reqParams = req.body;

  try {
    imageValidation(reqParams, res, async (validate) => {
      if (validate) {
        const imgExtension = reqParams.mimetype.split("/")[1];
        const imgFileName = reqParams.mimetype.split("/")[0];
        const fileName = `${Date.now()}${randomDigits(
          4
        )}-${imgFileName}.${imgExtension}`;
        const key = `${process.env.FILE_PATH_PROFILE}/${fileName}`;
        const expiresIn = 600;

        const profileImage = await Profile.update(
          { profile_picture: fileName },
          { where: { id: reqParams.id } }
        );

        if (!profileImage) {
          return errorResponseData(res, PROFILE_NOT_FOUND, 400);
        }

        const url = generatePreSignedUrl(
          process.env.AWS_BUCKET_NAME,
          key,
          expiresIn
        );
        responseSuccessWithMessage(res, { Profile_image: url }, IMAGE_UPLOADED);
      }
    });
  } catch (error) {
    return errorResponseData(res, error, 400);
  }
};

/**
 * @description This function will delete uploaded image from database and s3 Bucket.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */

const removeProfilePicture = async (req, res) => {
  const reqParams = req.body;
  try {
    const profileImage = await Profile.findOne({
      where: { id: reqParams.id },
    });

    if (!profileImage) {
      return errorResponseData(res, PROFILE_IMAGE_NOT_FOUND, 404);
    }

    await Profile.update(
      { profile_picture: null },
      { where: { profile_picture: profileImage.profile_picture } }
    );

    const file = `${process.env.FILE_PATH_PROFILE}/${profileImage.profile_picture}`;
    removeOldImage(process.env.AWS_BUCKET_NAME, file, res);
  } catch (error) {
    return errorResponseData(res, error, 400);
  }
};

module.exports = {
  userProfileForm,
  userProfile,
  userProfilePicture,
  removeProfilePicture,
};

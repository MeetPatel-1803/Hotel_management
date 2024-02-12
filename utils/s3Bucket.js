const aws = require("aws-sdk");
const { responseSuccessWithMessage, errorResponseData } = require("./response");
const { IMAGE_REMOVED } = require("./message");

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
};
const s3 = new aws.S3(credentials);

/**
 * @desc This function will generate pre-signed url for given image.
 * @param {*} AWS_BUCKET_NAME
 * @param {*} FILE_PATH
 * @param {*} expiresIn
 * @returns
 */

const generatePreSignedUrl = (AWS_BUCKET_NAME, FILE_PATH, expiresIn) => {
  return s3.getSignedUrl("putObject", {
    Bucket: AWS_BUCKET_NAME,
    Key: FILE_PATH,
    Expires: expiresIn,
  });
};

/**
 * @description This function will remove image from s3 bucket.
 * @param {*} AWS_BUCKET_NAME
 * @param {*} FILE_PATH
 * @param {*} res
 * @returns
 */
const removeOldImage = (AWS_BUCKET_NAME, FILE_PATH, res) => {
  return s3.deleteObject(
    {
      Bucket: AWS_BUCKET_NAME,
      Key: FILE_PATH,
    },
    (err, data) => {
      if (data) {
        return responseSuccessWithMessage(res, data, IMAGE_REMOVED);
      }

      return errorResponseData(res, err);
    }
  );
};

module.exports = { generatePreSignedUrl, removeOldImage };

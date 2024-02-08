const aws = require("aws-sdk");

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
};
const s3 = new aws.S3(credentials);

const generatePreSignedUrl = (AWS_BUCKET_NAME, FILE_PATH, expiresIn) => {
  return s3.getSignedUrl("putObject", {
    Bucket: AWS_BUCKET_NAME,
    Key: FILE_PATH,
    Expires: expiresIn,
  });
};

module.exports = generatePreSignedUrl;

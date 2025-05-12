const Joi = require("joi");
const {
  ROOM_TYPES,
  ROOM_STATUS,
  IMAGE_MIMETYPE,
} = require("../utils/constant");
const { errorResponseData } = require("../utils/response");

const createRoomValidation = (req, res, next) => {
  const pattern = new RegExp(`/^[A-Za-z0-9-_]+\/${IMAGE_MIMETYPE.join("|")}$/`);
  const schema = Joi.object({
    number: Joi.string()
      .pattern(/^\d{3}$/)
      .required(),
    type: Joi.string().valid(Object.values(ROOM_TYPES)).required(),
    price: Joi.number().min(0).precision(2).required(),
    status: Joi.string().valid(Object.values(ROOM_STATUS)).required(),
    image: Joi.string().optional().pattern(pattern),
  });
  const { error } = schema.validate(req);
  if (error) {
    return errorResponseData(res, error.message, 401);
  } else {
    return callback(true);
  }
};

const updateRoomValidation = (req, res, next) => {
  const pattern = new RegExp(`/^[A-Za-z0-9-_]+\/${IMAGE_MIMETYPE.join("|")}$/`);
  const schema = Joi.object({
    roomId: Joi.number().required(),
    number: Joi.string()
      .pattern(/^\d{3}$/)
      .required(),
    type: Joi.string().valid(Object.values(ROOM_TYPES)).required(),
    price: Joi.number().min(0).precision(2).required(),
    status: Joi.string().valid(Object.values(ROOM_STATUS)).required(),
    image: Joi.string().optional().pattern(pattern),
  });
  const { error } = schema.validate(req);
  if (error) {
    return errorResponseData(res, error.message, 401);
  } else {
    return callback(true);
  }
};

const deleteRoomValidation = (req, res, mext) => {
  const schema = Joi.object({
    roomId: Joi.number().required(),
  });
};

module.exports = {
  createRoomValidation,
  updateRoomValidation,
  deleteRoomValidation,
};

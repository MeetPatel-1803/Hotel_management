const Joi = require("joi");
const {
  ROOM_TYPES,
  ROOM_STATUS,
  IMAGE_MIMETYPE,
  PAGINATION,
} = require("../utils/constant");
const { errorResponseData } = require("../utils/response");

const createRoomValidation = (req, res, callback) => {
  const pattern = new RegExp(`/^[A-Za-z0-9-_]+\/${IMAGE_MIMETYPE.join("|")}$/`);
  const schema = Joi.object({
    number: Joi.string()
      .pattern(/^\d{3}$/)
      .required(),
    type: Joi.string().valid("delux").required(),
    price: Joi.number().min(0).precision(2).required(),
    status: Joi.string().valid("available").required(),
    // image: Joi.string().optional().pattern(pattern),
  });
  const { error } = schema.validate(req);
  if (error) {
    return errorResponseData(res, error.message, 401);
  } else {
    return callback(true);
  }
};

const updateRoomValidation = (req, res, callback) => {
  const pattern = new RegExp(`/^[A-Za-z0-9-_]+\/${IMAGE_MIMETYPE.join("|")}$/`);
  const schema = Joi.object({
    roomId: Joi.number().required(),
    number: Joi.string()
      .pattern(/^\d{3}$/)
      .required(),
    // type: Joi.string().valid(Object.values(ROOM_TYPES)).required(),
    price: Joi.number().min(0).precision(2).required(),
    // status: Joi.string().valid(Object.values(ROOM_STATUS)).required(),
    image: Joi.string().optional().pattern(pattern),
  });
  const { error } = schema.validate(req);
  if (error) {
    return errorResponseData(res, error.message, 401);
  } else {
    return callback(true);
  }
};

const deleteRoomValidation = (req, res, callback) => {
  const schema = Joi.object({
    roomId: Joi.number().required(),
  });
  const { error } = schema.validate(req);
  if (error) {
    return errorResponseData(res, error.message, 401);
  } else {
    return callback(true);
  }
};

const getAllRoomsValidation = (req, res, callback) => {
  const schema = Joi.object({
    roomId: Joi.number(),
    page: Joi.number().allow(""),
    perPage: Joi.number().max(PAGINATION.MAXIMUM_PER_PAGE).allow("").optional(),
    sortBy: Joi.string().allow("").optional(),
    sortType: Joi.string().valid("ASC", "DESC").optional().allow(""),
    minPrice: Joi.number().precision(2),
    maxPrice: Joi.number().precision(2),
    roomType: Joi.string()
      .valid(Object.values(ROOM_TYPES))
      .optional()
      .allow(""),
  });
  const { error } = schema.validate(req);
  if (error) {
    return errorResponseData(res, error.message, 401);
  } else {
    return callback(true);
  }
};

module.exports = {
  createRoomValidation,
  updateRoomValidation,
  deleteRoomValidation,
  getAllRoomsValidation,
};

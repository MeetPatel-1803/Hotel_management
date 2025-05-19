module.exports = {
  ROOM_TYPES: {
    SINGLE: "single",
    DOUBLE: "double",
    DELUX: "delux",
    SUPER_DELUX: "superDelux",
  },
  ROOM_STATUS: {
    AVAILABLE: "available",
    OCCUPIED: "occupied",
  },
  IMAGE_MIMETYPE: ["jpeg", "jpg", "png", "heic", "JPEG", "JPG", "PNG", "HEIC"],
  META_CODE: {
    FAIL: 0,
    SUCCESS: 1,
  },
  STATUS_CODE: {
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    UNAUTHORIZED: 401,
  },
  PAGINATION: {
    PAGE: 1,
    PER_PAGE: 10,
    MAXIMUM_PER_PAGE: 100,
  },
  USER_ROLE: {
    ADMIN: "admin",
    USER: "user",
  },
};

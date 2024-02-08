/**
 * This function will generate random digits of length 4
 * @param {*} length
 * @returns
 */

const randomDigits = (length) => {
  const digits = "0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += digits[Math.floor(Math.random() * 10)];
  }
  return result;
};

module.exports = randomDigits;

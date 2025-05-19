const randomTokens = (length) => {
  let token = "";
  for (let i = 1; i <= length; i++) {
    token += Math.random().toString(36).substring(2);
  }
  return token;
};

const randomDigits = (length) => {
  const digits = "0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += digits[Math.floor(Math.random() * 10)];
  }
  return result;
};

module.exports = {
  randomTokens,
  randomDigits,
};

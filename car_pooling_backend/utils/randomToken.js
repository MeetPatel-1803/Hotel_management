const randomTokens = (length) => {
  let token = "";
  for (let i = 1; i <= length; i++) {
    token += Math.random().toString(36).substring(2);
  }
  return token;
};

module.exports = randomTokens;

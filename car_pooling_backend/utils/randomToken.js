/**
 * This function will generate random tokens
 * @param {*} length  Ex: length = 1 will create 10 characters token
 * @returns 
 */

const randomTokens = (length) => {
  let token = "";
  for (let i = 1; i <= length; i++) {
    token += Math.random().toString(36).substring(2);
  }
  return token;
};

module.exports = randomTokens;

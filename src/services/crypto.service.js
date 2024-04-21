const CryptoJS = require('crypto-js');

const objectToString = (obj) => {
  return JSON.stringify(obj);
};

const stringToObject = (str) => {
  return JSON.parse(str);
};

const encrypt = (plainText, secret) => {
  return CryptoJS.AES.encrypt(plainText, secret).toString();
};

const decrypt = (cipherText, secret) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, secret);
  return bytes.toString(CryptoJS.enc.Utf8);
};

const encryptObj = (obj, secret) => {
  return encrypt(objectToString(obj), secret);
};

const decryptObj = (cipherText, secret) => {
  return stringToObject(decrypt(cipherText, secret));
};

module.exports = {
  encrypt,
  decrypt,
  encryptObj,
  decryptObj,
  objectToString,
  stringToObject,
};

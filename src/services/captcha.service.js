const svgCaptcha = require('svg-captcha');

const { env } = require('../config');
const { encryptObj } = require('./crypto.service');
const { EXPIRES_TOKEN_CAPTCHA } = require('../constants');

const generate = () => {
  const { text, data: image } = svgCaptcha.create();
  // const base64 = `data:image/svg+xml;base64,${Buffer.from(image).toString('base64')}`;
  const expires = Date.now() + EXPIRES_TOKEN_CAPTCHA;

  const sign = encryptObj(
    JSON.stringify({
      text,
      expires,
    }),
    env.secret.tokenForgot,
  );

  return { sign, image };
};

module.exports = { generate };

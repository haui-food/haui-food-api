const nodemailer = require('nodemailer');

const { env, logger } = require('../config');

const transport = nodemailer.createTransport(env.email.smtp);
transport
  .verify()
  .then(() => logger.info('Connected to email server'))
  .catch(() => logger.error('Connect to email server failed'));

const sendEmail = async (options) => {
  const message = {
    from: `no-reply <${env.email.from}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };
  await transport.sendMail(message);
};

module.exports = {
  sendEmail,
};

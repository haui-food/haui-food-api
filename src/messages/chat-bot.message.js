const { i18nService } = require('../config');

const chatBotMessage = () => {
  return {
    SUCCESS: i18nService.translate('chatBot', 'success'),
    FAILED: i18nService.translate('chatBot', 'failed'),
  };
};

module.exports = chatBotMessage;

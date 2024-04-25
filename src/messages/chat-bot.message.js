const { i18nService } = require('../config');

const chatBotMessage = () => {
  return {
    SUCCESS: i18nService.translate('chatBot', 'success'),
    FAILED: i18nService.translate('chatBot', 'failed'),
    RETRY: i18nService.translate('chatBot', 'retry'),
  };
};

module.exports = chatBotMessage;

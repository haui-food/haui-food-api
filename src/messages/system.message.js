const { i18nService } = require('../config');

const systemMessage = () => {
  return {
    RESOURCE_NOT_FOUND: i18nService.translate('system', 'resourceNotFound'),
    EMAIL_FROM: i18nService.translate('system', 'emailFrom'),
  };
};

module.exports = systemMessage;

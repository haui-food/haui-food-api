const { i18nService } = require('../config');

const systemMessage = () => {
  return {
    RESOURCE_NOT_FOUND: i18nService.translate('system', 'resourceNotFound'),
    EMAIL_FROM: i18nService.translate('system', 'emailFrom'),
    MANY_REQUESTS: i18nService.translate('system', 'manyRequests'),
    IMAGE_INVALID: i18nService.translate('system', 'imageInvalid'),
    IMAGE_MAX_SIZE: i18nService.translate('system', 'imageMaxSize'),
    FILE_INVALID: i18nService.translate('system', 'fileInvalid'),
    FILE_MAX_SIZE: i18nService.translate('system', 'fileMaxSize'),
  };
};

module.exports = systemMessage;

const { i18nService } = require('../config');

const systemMessage = () => {
  return {
    EMAIL_FROM: i18nService.translate('system.emailFrom'),
    FILE_INVALID: i18nService.translate('system.fileInvalid'),
    FILE_MAX_SIZE: i18nService.translate('system.fileMaxSize'),
    MANY_REQUESTS: i18nService.translate('system.manyRequests'),
    IMAGE_INVALID: i18nService.translate('system.imageInvalid'),
    IMAGE_MAX_SIZE: i18nService.translate('system.imageMaxSize'),
    URI_QR_INVALID: i18nService.translate('system.uriQRInvalid'),
    RESOURCE_NOT_FOUND: i18nService.translate('system.resourceNotFound'),
  };
};

module.exports = systemMessage;

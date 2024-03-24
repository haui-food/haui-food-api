const { i18nService } = require('../config');

const contactMessage = () => {
  return {
    SEND_SUCCESS: i18nService.translate('contact', 'sendSuccess'),
    SEND_FAIL: i18nService.translate('contact', 'sendFail'),
    NOT_FOUND: i18nService.translate('contact', 'notFound'),
    DELETE_SUCCESS: i18nService.translate('contact', 'deleteSuccess'),
    FIND_SUCCESS: i18nService.translate('contact', 'findSuccess'),
    FIND_LIST_SUCCESS: i18nService.translate('contact', 'findListSuccess'),
    MESSAGE_REQUIRED: i18nService.translate('contact', 'messageRequired'),
    MESSAGE_LENGTH: i18nService.translate('contact', 'messageLength'),
  };
};

module.exports = contactMessage;

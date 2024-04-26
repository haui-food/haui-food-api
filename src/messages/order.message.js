const { i18nService } = require('../config');

const categoryMessage = () => {
  return {
    NOT_FOUND: i18nService.translate('order.notFound'),
    FIND_SUCCESS: i18nService.translate('order.findSuccess'),
    CREATE_SUCCESS: i18nService.translate('order.createSuccess'),
    UPDATE_SUCCESS: i18nService.translate('order.updateSuccess'),
    DELETE_SUCCESS: i18nService.translate('order.deleteSuccess'),
    ALREADY_EXISTS: i18nService.translate('order.alreadyExists'),
    FIND_LIST_SUCCESS: i18nService.translate('order.findListSuccess'),
  };
};

module.exports = categoryMessage;

const { i18nService } = require('../config');

const categoryMessage = () => {
  return {
    NOT_FOUND: i18nService.translate('cart.notFound'),
    FIND_SUCCESS: i18nService.translate('cart.findSuccess'),
    CREATE_SUCCESS: i18nService.translate('cart.createSuccess'),
    UPDATE_SUCCESS: i18nService.translate('cart.updateSuccess'),
    DELETE_SUCCESS: i18nService.translate('cart.deleteSuccess'),
    ALREADY_EXISTS: i18nService.translate('cart.alreadyExists'),
    FIND_LIST_SUCCESS: i18nService.translate('cart.findListSuccess'),
  };
};

module.exports = categoryMessage;

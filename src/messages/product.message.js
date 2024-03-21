const { i18nService } = require('../config');

const categoryMessage = () => {
  return {
    NOT_FOUND: i18nService.translate('product', 'notFound'),
    FIND_SUCCESS: i18nService.translate('product', 'findSuccess'),
    FIND_LIST_SUCCESS: i18nService.translate('product', 'findListSuccess'),
    CREATE_SUCCESS: i18nService.translate('product', 'createSuccess'),
    UPDATE_SUCCESS: i18nService.translate('product', 'updateSuccess'),
    DELETE_SUCCESS: i18nService.translate('product', 'deleteSuccess'),
    INCORRECT_ID: i18nService.translate('product', 'incorrectId'),
  };
};

module.exports = categoryMessage;

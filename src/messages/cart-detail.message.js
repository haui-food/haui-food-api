const { i18nService } = require('../config');

const cartDetailMessage = () => {
  return {
    NOT_FOUND: i18nService.translate('cartDetail', 'notFound'),
    FIND_SUCCESS: i18nService.translate('cartDetail', 'findSuccess'),
    FIND_LIST_SUCCESS: i18nService.translate('cartDetail', 'findListSuccess'),
    CREATE_SUCCESS: i18nService.translate('cartDetail', 'createSuccess'),
    UPDATE_SUCCESS: i18nService.translate('cartDetail', 'updateSuccess'),
    DELETE_SUCCESS: i18nService.translate('cartDetail', 'deleteSuccess'),
    ALREADY_EXISTS: i18nService.translate('cartDetail', 'alreadyExists'),
  };
};

module.exports = cartDetailMessage;

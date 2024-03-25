const { i18nService } = require('../config');

const categoryMessage = () => {
  return {
    NOT_FOUND: i18nService.translate('message', 'notFound'),
    FIND_SUCCESS: i18nService.translate('message', 'findSuccess'),
    FIND_LIST_SUCCESS: i18nService.translate('message', 'findListSuccess'),
    CREATE_SUCCESS: i18nService.translate('message', 'createSuccess'),
    DELETE_SUCCESS: i18nService.translate('message', 'deleteSuccess'),
  };
};

module.exports = categoryMessage;

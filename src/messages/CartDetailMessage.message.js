const { i18nService } = require('../config');

const categoryMessage = () => {
  return {
    NOT_FOUND: i18nService.translate('CartDetail', 'notFound'),
    FIND_SUCCESS: i18nService.translate('CartDetail', 'findSuccess'),
    FIND_LIST_SUCCESS: i18nService.translate('CartDetail', 'findListSuccess'),
    CREATE_SUCCESS: i18nService.translate('CartDetail', 'createSuccess'),
    UPDATE_SUCCESS: i18nService.translate('CartDetail', 'updateSuccess'),
    DELETE_SUCCESS: i18nService.translate('CartDetail', 'deleteSuccess'),
  };
};

module.exports = categoryMessage;

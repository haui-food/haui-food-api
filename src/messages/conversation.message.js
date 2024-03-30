const { i18nService } = require('../config');

const categoryMessage = () => {
  return {
    NOT_FOUND: i18nService.translate('conversation', 'notFound'),
    FIND_SUCCESS: i18nService.translate('conversation', 'findSuccess'),
    FIND_LIST_SUCCESS: i18nService.translate('conversation', 'findListSuccess'),
    CREATE_SUCCESS: i18nService.translate('conversation', 'createSuccess'),
    UPDATE_SUCCESS: i18nService.translate('conversation', 'updateSuccess'),
    DELETE_SUCCESS: i18nService.translate('conversation', 'deleteSuccess'),
    ALREADY_EXISTS: i18nService.translate('conversation', 'alreadyExists'),
  };
};

module.exports = categoryMessage;

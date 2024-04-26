const { i18nService } = require('../config');

const userMessage = () => {
  return {
    NOT_FOUND: i18nService.translate('user.notFound'),
    USER_LOCKED: i18nService.translate('user.userLocked'),
    EXISTS_EMAIL: i18nService.translate('user.existsEmail'),
    FIND_SUCCESS: i18nService.translate('user.findSuccess'),
    ROLE_INVALID: i18nService.translate('user.roleInvalid'),
    INCORRECT_ID: i18nService.translate('user.incorrectId'),
    EMAIL_INVALID: i18nService.translate('user.emailInvalid'),
    CREATE_SUCCESS: i18nService.translate('user.createSuccess'),
    UPDATE_SUCCESS: i18nService.translate('user.updateSuccess'),
    DELETE_SUCCESS: i18nService.translate('user.deleteSuccess'),
    LOCKED_SUCCESS: i18nService.translate('user.lockedSuccess'),
    PASSWORD_LENGTH: i18nService.translate('user.passwordLength'),
    PASSWORD_INVALID: i18nService.translate('user.passwordInvalid'),
    UNLOCKED_SUCCESS: i18nService.translate('user.unlockedSuccess'),
    FIND_LIST_SUCCESS: i18nService.translate('user.findListSuccess'),
  };
};

module.exports = userMessage;

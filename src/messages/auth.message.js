const { i18nService } = require('../config');

const authMessage = () => {
  return {
    INVALID_LOGIN: i18nService.translate('auth', 'invalidLogin'),
    LOGIN_SUCCESS: i18nService.translate('auth', 'loginSuccess'),
  };
};

module.exports = authMessage;

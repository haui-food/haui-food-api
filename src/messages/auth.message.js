const { i18nService } = require('../config');

const authMessage = () => {
  return {
    INVALID_LOGIN: i18nService.translate('auth', 'invalidLogin'),
    LOGIN_SUCCESS: i18nService.translate('auth', 'loginSuccess'),
    REGISTER_SUCCESS: i18nService.translate('auth', 'registerSuccess'),
    REFRESH_TOKEN_SUCCESS: i18nService.translate('auth', 'refreshTokenSuccess'),
    INVALID_TOKEN: i18nService.translate('auth', 'invalidToken'),
    UNAUTHORIZED: i18nService.translate('auth', 'unauthorized'),
    FORBIDDEN: i18nService.translate('auth', 'forbidden'),
    TOKEN_EXPIRED: i18nService.translate('auth', 'tokenExpired'),
    GET_ME_SUCCESS: i18nService.translate('auth', 'getMeSuccess'),
    INVALID_PASSWORD: i18nService.translate('auth', 'invalidPassword'),
    CHANGE_PASSWORD_SUCCESS: i18nService.translate('auth', 'changePasswordSuccess'),
    UPDATE_ME_SUCCESS: i18nService.translate('auth', 'updateMeSuccess'),
    ON_2FA_SUCCESS: i18nService.translate('auth', 'on2FASuccess'),
    OFF_2FA_SUCCESS: i18nService.translate('auth', 'off2FASuccess'),
    INVALID_2FA_CODE: i18nService.translate('auth', 'invalid2FACode'),
    LENGTH_CODE_VERIFY: i18nService.translate('auth', 'lengthCodeVerify'),
    PLEASE_BYPASS_2FA: i18nService.translate('auth', 'pleaseBypass2FA'),
    GENERATE_2FA_SUCCESS: i18nService.translate('auth', 'generate2FASuccess'),
    CHANGE_2FA_SUCCESS: i18nService.translate('auth', 'change2FASuccess'),
    INVALID_TOKEN_VERIFY_EXPIRED: i18nService.translate('auth', 'invalidTokenVerifyExpired'),
    VERIFY_EMAIL_SUCCESS: i18nService.translate('auth', 'verifyEmailSuccess'),
    PLEASE_WAIT: i18nService.translate('auth', 'pleaseWait'),
    RESEND_EMAIL_SUCCESS: i18nService.translate('auth', 'resendEmailSuccess'),
    PLEASE_VERIFY_EMAIL: i18nService.translate('auth', 'pleaseVerifyEmail'),
    EMAIL_NOT_EXISTS: i18nService.translate('auth', 'emailNotExists'),
    FORGOT_PASSWORD_SUCCESS: i18nService.translate('auth', 'fotgotPasswordSuccess'),
    VERIFY_OTP_SUCCESS: i18nService.translate('auth', 'verifyOTPSuccess'),
    INVALID_OTP: i18nService.translate('auth', 'invalidOTP'),
  };
};

module.exports = authMessage;

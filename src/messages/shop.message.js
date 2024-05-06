const { i18nService } = require('../config');

const shopMessage = () => {
  return {
    NOT_FOUND: i18nService.translate('shop.notFound'),
    FIND_SUCCESS: i18nService.translate('shop.findSuccess'),
    SHOP_DETAIL: i18nService.translate('shop.shopDetail'),
    RESULT_FIND: i18nService.translate('shop.resultFind'),
  };
};

module.exports = shopMessage;

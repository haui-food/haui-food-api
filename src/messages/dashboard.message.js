const { i18nService } = require('../config');

const dashboardMessage = () => {
  return {
    STATISTICAL_SALES: i18nService.translate('dashboard.statisticalSales'),
    STATISTICAL_NEWUSER: i18nService.translate('dashboard.statisticalNewUser'),
    STATISTICAL_ORDER: i18nService.translate('dashboard.statisticalOrder'),
    STATISTICAL_MESSAGE: i18nService.translate('dashboard.statisticalMessage'),
    STATISTICAL_USER_BY_ROLE: i18nService.translate('dashboard.statisticalUserByRole'),
  };
};

module.exports = dashboardMessage;

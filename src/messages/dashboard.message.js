const { i18nService } = require('../config');

const dashboardMessage = () => {
  return {
    STATISTICAL_SALES: i18nService.translate('dashboard.statisticalSales'),
    STATISTICAL_NEWUSER: i18nService.translate('dashboard.statisticalNewUser'),
  };
};

module.exports = dashboardMessage;

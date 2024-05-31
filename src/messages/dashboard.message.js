const { i18nService } = require('../config');

const dashboardMessage = () => {
  return {
    STATISTICAL_SALES: i18nService.translate('dashboard.statisticalSales'),
  };
};

module.exports = dashboardMessage;

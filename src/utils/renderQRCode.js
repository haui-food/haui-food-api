const QRCode = require('qrcode');

const options = {
  margin: 2,
  width: 300,
  height: 300,
  quality: 0.3,
  type: 'image/jpeg',
  errorCorrectionLevel: 'H',
};

const renderQRCode = async (url) => {
  return QRCode.toBuffer(url, options);
};

module.exports = renderQRCode;

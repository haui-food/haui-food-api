const fs = require('fs');
const path = require('path');

const { LOG_DIR, LOG_FILENAME } = require('../constants');

const initLogDirFile = () => {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR);
  }

  if (!fs.existsSync(LOG_FILENAME)) {
    fs.writeFileSync(path.join(LOG_DIR, LOG_FILENAME), '');
  }
};

module.exports = initLogDirFile;

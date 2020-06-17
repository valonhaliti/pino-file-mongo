const fs = require('fs');

function tailAgain({ startTailing, filename, logger }) {
  let tried = 0,
    maxTried = 20,
    continueTrying = true,
    retryInSec = 5;

  _tailAgain();

  function _tailAgain() {
    if (fs.existsSync(filename)) {
      continueTrying = false;
      startTailing();
    } else {
      if (tried < maxTried && continueTrying) {
        logger.info(`Retrying to tail in ${retryInSec} sec`);
        setTimeout(_tailAgain, retryInSec * 1000);
      } else if (tried == maxTried && continueTrying) {
        logger.info(`Failed to tail after ${maxTried} retries.`);
      }
      tried++;
    }
  }
}

module.exports = { tailAgain };

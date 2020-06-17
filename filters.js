const pathsToBeIgnored = require('./paths-to-ignore');

function shouldLogBeIgnored({ url = '', method = '' }) {
  if (url && _shouldUrlBeIgnored(url)) {
    return true;
  }
  if (method === 'OPTIONS') {
    return true;
  }

  return false;
}

function _shouldUrlBeIgnored(url) {
  for (const path of pathsToBeIgnored) {
    if (url.includes(path)) {
      return true;
    }
  }
  return false;
}

module.exports = {
  shouldLogBeIgnored
};

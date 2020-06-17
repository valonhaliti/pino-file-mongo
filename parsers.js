const { getAlias } = require('./mapping');

module.exports.parseLog = function parseLog(log) {
  const parsedLog = JSON.parse(log);
  parsedLog.name = getAlias('name', log.name);

  return parsedLog;
};

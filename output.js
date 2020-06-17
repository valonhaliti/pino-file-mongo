const LogModel = require('./models/LogModel');

async function insertLog(logObj) {
  const log = new LogModel(logObj);
  await log.save(logObj);
}

module.exports = {
  insertLog
};

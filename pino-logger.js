const pino = require('pino');
const logger = require('pino')(pino.destination('./logs/pinologtomongodb.log'));

module.exports = logger;

const Tail = require('always-tail');
const fs = require('fs');
const config = require('../config');
const mongoose = require('mongoose');
const getFilename = require('./get-filename');
const { shouldLogBeIgnored } = require('./filters');
const output = require('./output');
const { tailAgain } = require('./retry');
const { parseLog } = require('./parsers');

const logger = require('./pino-logger');
const { rejects } = require('assert');

const filename = getFilename();
if (!fs.existsSync(filename)) {
  fs.writeFileSync(filename, '');
}

let tail = null;
async function startTailing() {
  logger.info(`Starting to tail: ${filename}`);

  try {
    await mongoose.connect(config.mongoConnectionUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await isMappingReady();
    tail = new Tail(filename, null);

    tail.on('line', handleLine);

    tail.on('error', logger.error);

    tail.watch();
  } catch (err) {
    logger.error(err);
    if (tail) {
      tail.unwatch();
    }
  }
}

async function handleLine(line) {
  try {
    // 1. parse
    const parsedLog = parseLog(line);

    // 2. filter
    if (shouldLogBeIgnored(parsedLog)) {
      return;
    }

    // 3. insert
    await output.insertLog(parsedLog);
  } catch (err) {
    logger.error(err);
  }
}

function isMappingReady() {
  const { isMappingReady } = require('./mapping');
  return new Promise((resolve) => {
    resolveWhenMappingReady(resolve, isMappingReady);
  });
}

function resolveWhenMappingReady(resolve, isMappingReady) {
  if (isMappingReady()) {
    resolve();
  } else {
    setTimeout(() => {
      resolveWhenMappingReady(resolve, isMappingReady);
    }, 500);
  }
}

process.on('uncaughtException', function (error) {
  if (tail) {
    tail.unwatch();
  }
  logger.error(error.stack);
  tailAgain({ startTailing, filename, logger });
});

startTailing();

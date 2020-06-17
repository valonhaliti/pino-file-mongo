const logger = require('./pino-logger');
const MappingModel = require('./models/Mapping');
const mongoose = require('mongoose');
const config = require('../../config');

let map = null;
module.exports.getAlias = function getAlias(type, key) {
  let alias = map[type] ? map[type][key] : null;
  if (!alias) {
    logger.error(`Failed to map: [${type}][${key}]`);
    return 0;
  } else {
    return alias;
  }
};

(async function getMapFromMongoDb() {
  await mongoose.connect(config.mongoConnectionUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const mappings = await MappingModel.find({}, { __v: 0, _id: 0 })
    .lean()
    .exec();
  if (mappings.length == 0) {
    // insert map from a file...
  } else {
    map = mappings[0];
  }
})();

module.exports.isMappingReady = () => map !== null;

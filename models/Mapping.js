const mongoose = require('mongoose');
const { Schema } = mongoose;

const MappingSchema = new Schema({}, { strict: false });

const MappingModel = mongoose.model('mapping', MappingSchema);
module.exports = MappingModel;

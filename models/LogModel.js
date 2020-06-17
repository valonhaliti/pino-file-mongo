const mongoose = require('mongoose');
const { Schema } = mongoose;

const LogSchema = new Schema(
  {
    name: {
      type: Number,
      index: true
    },
    time: {
      type: Date,
      index: true
    }
  },
  { strict: false }
);

const LogModel = mongoose.model('Applog', LogSchema);
module.exports = LogModel;

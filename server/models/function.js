const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Contact = require('./contact')

const FunctionSchema = new Schema({
  name: { type: String },
  description: { type: String },
  contacts: [Contact]
});

mongoose.model('function', FunctionSchema);

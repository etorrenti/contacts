const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Contact = require('./contact')

const FunctionSchema = new Schema({
  name: { type: String },
  description: { type: String },
  contacts: [{
    type: Schema.Types.ObjectId,
    ref: 'contact'
  }]
});

mongoose.model('function', FunctionSchema);

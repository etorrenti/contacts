const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Function = require('./function')

const OrganizationSchema = new Schema({
  name: { type: String },
  description: { type: String },
  address: { type: String },
  prov: { type: String },
  state: { type: String },
  location: [Number],
  functions: [Function]
});

mongoose.model('organization', OrganizationSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PersonSchema = new Schema({
  name: { type: String },
  description: { type: String },
  address: {},
  location: [Number]
});

mongoose.model('person', PersonSchema);

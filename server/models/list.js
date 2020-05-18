const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Person = require('./person');

const ListSchema = new Schema({
  name: { type: String },
  description: { type: String },
  people: [Person]
});

mongoose.model('list', ListSchema);

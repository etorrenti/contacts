const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
  type: { type: String },
  value: { type: String }
});

mongoose.model('contact', ContactSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PersonSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  // address: {},
  contacts: [{
    contactType: String,
    value: String
  }]
},
{
  usePushEach: true
});

PersonSchema.statics.addContact = function({personId, type, value}) {
  // const Contact = mongoose.model('contact');

  return this.findById(personId)
    .then(person => {
      if(!person){
        return null;
      }
      // const ct = new Contact({ type, value })
      const ct = {contactType: type, value}
      person.contacts.push(ct)
      return person.save()
    });
}

PersonSchema.statics.findContacts = function(id) {
  return this.findById(id)
    .populate('contacts')
    .then(person => {
      return person.contacts;
    });
}

PersonSchema.statics.search = function({query}) {
  const re = new RegExp(query, 'i');
  return this.find({$or: [
    {firstName: re},
    {lastName: re}
  ]});
}

mongoose.model('person', PersonSchema);

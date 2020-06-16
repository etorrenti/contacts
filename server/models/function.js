const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FunctionSchema = new Schema({
  name: { type: String },
  description: { type: String },
  contacts: [{
    contactType: String,
    value: String
  }]
},
{
  usePushEach: true
});

FunctionSchema.statics.addContact = function({functionId, contactType, contact}) {
  console.log({functionId, contactType, contact})
  return this.findById(functionId)
    .then(func => {
      if(!func){
        return null;
      }
      // const ct = new Contact({ type, value })
      const ct = {contactType, value: contact}
      func.contacts.push(ct)
      return func.save()
    });
}

FunctionSchema.statics.deleteContact = function({functionId, contact, contactType}) {
  return this.findById(functionId)
    .then(funct => {
      if(!funct){
        return null;
      }
      let i = funct.contacts.findIndex(x => x.contactType == contactType && x.value == contact);
      if(i >= 0){
        funct.contacts.splice(i, 1);
      }
      return funct.save()
    });
}

FunctionSchema.statics.findContacts = function(id) {
  return this.findById(id)
    .populate('contacts')
    .then(func => {
      return func.contacts;
    });
}


mongoose.model('function', FunctionSchema);

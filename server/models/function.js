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
      const ct = {contactType, value: contact}

      //Check if exists already
      const i = func.contacts.findIndex(x => x.value == contact && x.contactType == contactType)
      if(i >= 0){
        return func;
      }

      func.contacts.push(ct)
      return func.save()
    });
}

FunctionSchema.statics.updateContact = function({functionId, contactId, contactType, contact}) {
  return this.findById(functionId)
    .then(func => {
      if(!func){
        return null;
      }
      const ct = {contactType, value: contact}

      //Check if exists already
      const i = func.contacts.findIndex(x => x.id == contactId)
      if(i >= 0){
        func.contacts[i] = ct;
      }

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

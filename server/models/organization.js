const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Function = require('./function')
const Person = require('./person')

const OrganizationSchema = new Schema({
  name: { type: String },
  description: { type: String },
  address: { type: String },
  prov: { type: String },
  state: { type: String },
  location: [Number],
  functions: [{
    type: Schema.Types.ObjectId,
    ref: 'function'
  }],
  roles: [
    {
      title: { type: String },
      person: {
        type: Schema.Types.ObjectId,
        ref: 'person'
      }
    }
  ]
},
{
  usePushEach: true
});

OrganizationSchema.statics.addFunction = function({organizationId, name, description}) {
  const Function = mongoose.model('function');
  return this.findById(organizationId)
    .then(org => {
      if(!org){
        return null;
      }
      const funct = new Function({ name, description, org })
      org.functions.push(funct)
      return Promise.all([funct.save(), org.save()])
        .then(([funct, org]) => org);
    });
}

OrganizationSchema.statics.addRole = function({organizationId, title, personId}) {
  return Promise.all([this.findById(organizationId), Person.findById(personId)])
    .then(([org, person]) => {
      if(!org){
        return null;
      }
      const role = {title, person}
      org.roles.push(role)
      return org
    });
}

OrganizationSchema.statics.deleteFunction = function({organizationId, functionId}) {
  const Function = mongoose.model('function');
  return this.findById(organizationId)
    .then(org => {
      if(!org){
        return null;
      }

      let i = org.functions.findIndex(x => x.id == functionId);
      if(i >= 0){
        org.functions.splice(i, 1);
      }

      return Promise.all([i >= 0 ? org.save() : org, Function.deleteOne({_id: functionId})])
        .then(([org, funct]) => org);
    })
}

OrganizationSchema.statics.deleteRole = function({organizationId, title, personId}) {
  return this.findById(organizationId)
    .then(org => {
      if(!org){
        return null;
      }

      let i = org.roles.findIndex(x => x.title == title && x.person._id == personId );
      if(i >= 0){
        org.roles.splice(i, 1);
      }
      return org.save()
    })
}

OrganizationSchema.statics.findFunctions = function(id) {
  return this.findById(id)
    .populate('functions')
    .then(org => {
      // console.log(org.functions)
      return org.functions
    });
}

OrganizationSchema.statics.findRoles = function(id) {
  return this.findById(id)
    .then(org => {
      console.log(org.roles)
      return org.roles.map(x => x.populate('persons'))
    });
}

mongoose.model('organization', OrganizationSchema);

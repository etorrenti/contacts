const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrganizationSchema = new Schema({
  name: { type: String },
  description: { type: String },
  address: { type: String },
  city: { type: String },
  prov: { type: String },
  state: { type: String },
  location: [Number],
  functions: [{
    type: Schema.Types.ObjectId,
    ref: 'function'
  }],
  roles: [{
    type: Schema.Types.ObjectId,
    ref: 'role'
  }],
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
  const Person = mongoose.model('person');
  const Role = mongoose.model('role');
  return Promise.all([this.findById(organizationId), Person.findById(personId)])
    .then(([org, person]) => {
      if(!org){
        return null;
      }
      const pId = person == null ? null : person.id;
      const role = new Role({title, person: pId, organization: org.id})
      console.log("Insert role:", role)
      if(!org.roles){
        org.roles = []
      }
      org.roles.push(role)
      return Promise.all([org.save(), role.save()])
      .then(([org, role]) => org)
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
    .populate({
      path:"roles",
      populate:{path: "person", model:"person"}
    })
    .then(org => {
      if(!org){
        return null;
      }

      let i = org.roles.findIndex(x => {
        if(x.title == title) {
          return (x.person && x.person.id == personId)
            || (!x.person && !personId)
        }
        return false;
      });

      let role = null;
      if(i >= 0){
        role = org.roles[i]
        org.roles.splice(i, 1);
      }
      const Role = mongoose.model('role');
      let promises = [org.save()];
      if(role){
        promises.push(Role.deleteOne({_id: role.id}));
      }
      return Promise.all(promises)
      .then(([org, role]) => org)
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
    .populate({
      path:"roles",
      populate:{path: "person", model:"person"}
    }).then(org => org.roles);
}

mongoose.model('organization', OrganizationSchema);

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
  functions: [{
    type: Schema.Types.ObjectId,
    ref: 'function'
  }]
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

OrganizationSchema.statics.findFunctions = function(id) {
  return this.findById(id)
    .populate('functions')
    .then(org => {
      // console.log(org.functions)
      return org.functions
    });
}

mongoose.model('organization', OrganizationSchema);

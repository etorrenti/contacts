const graphql = require('graphql');
const {GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLID, GraphQLNonNull} = graphql;
const mongoose = require('mongoose');
const Organization = mongoose.model('organization');
const OrganizationType = require('./organization_type');
const Person = mongoose.model('person');
const PersonType = require('./person_type');
const List = mongoose.model('list');
const ListType = require('./list_type');
const Function = mongoose.model('function');
const FunctionType = require('./function_type');

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addOrganization: {
      type: OrganizationType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        address: { type: GraphQLString },
        city: { type: GraphQLString },
        prov:{ type: GraphQLString },
        state: { type: GraphQLString },
        lat: { type: GraphQLFloat },
        lon: { type: GraphQLFloat },
      },
      resolve(parentValue, {name, address, city, prov, state, lat, lon}) {
        let location = [0.0, 0.0];
        if(lat && lon) {
          location = [lon, lat];
        }
        return (new Organization({name, address, city, prov, state, lat, lon}))
          .save()
      }
    },
    deleteOrganization: {
      type: OrganizationType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parentValue, {id}) {
        return Organization.remove({_id: id})
      }
    },
    addRole: {
      type: OrganizationType,
      args: {
        organizationId: { new GraphQLNonNull(GraphQLID) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        personId: { GraphQLID }
      },
      resolve(parentValue, {organizationId, title, personId}){
        return Organization.addRole({organizationId, title, personId})
      }
    },
    deleteRole: {
      type: OrganizationType,
      args: {
        organizationId: { new GraphQLNonNull(GraphQLID) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        personId: { GraphQLID }
      },
      resolve(parentValue, {organizationId, title, personId}){
        return Organization.deleteRole({organizationId, title, personId})
      }
    },
    addFunction: {
      type: FunctionType,
      args: {
        organizationId: { type: new GraphQLNonNull(GraphQLID) },
        name: {type: new GraphQLNonNull(GraphQLString)},
        description: {type: GraphQLString},
      },
      resolve(parentValue, {organizationId, name, description}){
        return Organization.addFunction({organizationId, name, description})
      }
    },
    addContactToFunction: {
      type: FunctionType,
      args: {
        functionId: { type: new GraphQLNonNull(GraphQLID) },
        contact : { type: new GraphQLNonNull(GraphQLString) },
        contactType : { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, {functionId, contact, contactType}) {
        // console.log({functionId, contact, contactType})
        return Function.addContact({functionId, contact, contactType});
      }
    },
    deleteContactInFunction: {
      type: FunctionType,
      args: {
        functionId: { type: new GraphQLNonNull(GraphQLID) },
        contact : { type: new GraphQLNonNull(GraphQLString) },
        contactType : { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, {functionId, contact, contactType}) {
        return Function.deleteContact({functionId, contact, contactType});
      }
    },
    deleteFunction: {
      type: FunctionType,
      args: {
        organizationId: { type: new GraphQLNonNull(GraphQLID) },
        functionId: {type: new GraphQLNonNull(GraphQLID)}
      },
      resolve(parentValue, {organizationId, functionId}){
        return Organization.deleteFunction({organizationId, functionId})
      }
    },
    addPerson: {
      type: PersonType,
      args: {
        firstName : { type: new GraphQLNonNull(GraphQLString) },
        lastName : { type: new GraphQLNonNull(GraphQLString) },
        contact : { type: GraphQLString },
        contactType : { type: GraphQLString }
      },
      resolve(parentValue, {firstName, lastName, contact, contactType}) {
        let ct = null, contacts = [];
        if(contact){
          ct = {value: contact, contactType: contactType}
          contacts.push(ct);
        }
        console.log({firstName, lastName, contacts})
        return (new Person({firstName, lastName, contacts}))
          .save()
      }
    },
    deletePerson: {
      type: PersonType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parentValue, {id}) {
        return Person.remove({_id: id})
      }
    },
    addContactToPerson: {
      type: PersonType,
      args: {
        personId : { type: new GraphQLNonNull(GraphQLID) },
        contact : { type: new GraphQLNonNull(GraphQLString) },
        contactType : { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parentValue, {personId, contact, contactType}) {
        let person = await Person.findById(personId);
        if(!person){
          return null;
        }
        let k = {
          contactType, value: contact
        }
        if(!person.contacts){
          person.contacts = []
        }
        person.contacts.push(k);
        return person.save();
      }
    },
    deleteContactInPerson: {
      type: PersonType,
      args: {
        personId : { type: new GraphQLNonNull(GraphQLID) },
        contact : { type: new GraphQLNonNull(GraphQLString) },
        contactType : { type: GraphQLString }
      },
      async resolve(parentValue, {personId, contact, contactType}) {
        let person = await Person.findById(personId);
        if(!person){
          return null;
        }
        let k = {
          contactType, value: contact
        }
        if(!person.contacts){
          person.contacts = []
        } else {
          let i = person.contacts.findIndex( x => x.contactType == contactType && x.value == contact);
          if(i >= 0){
            person.contacts.splice(i, 1);
          }
        }

        return person.save();
      }
    },
    addList: {
      type: ListType,
      args: {
        name : { type: new GraphQLNonNull(GraphQLString) },
        description : { type: GraphQLString },
      },
      resolve(parentValue, {name, description}) {
        return (new List({name, description}))
          .save()
      }
    },
    deleteList: {
      type: ListType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parentValue, {id}) {
        return List.remove({_id: id})
      }
    },
  }
});

module.exports = mutation;

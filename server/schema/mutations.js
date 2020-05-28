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
    addFunction: {
      type: FunctionType,
      args: {
        organizationId: { type: new GraphQLNonNull(GraphQLID) },
        name: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(parentValue, {organizationId, name}){
        return Organization.addFunction({organizationId, name})
      }
    },
    addPerson: {
      type: OrganizationType,
      args: {
        firstName : { type: new GraphQLNonNull(GraphQLString) },
        lastName : { type: new GraphQLNonNull(GraphQLString) },
        contact : { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, {firstName, lastName, contact, organizationId, role}) {
        return (new Person({firstName, lastName, contact, organizationId, role}))
          .save()
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

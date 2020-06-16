const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLList, GraphQLID, GraphQLNonNull, GraphQLString } = graphql;
const PersonType = require('./person_type');
const Person = mongoose.model('person');
const OrganizationType = require('./organization_type');
const Organization = mongoose.model('organization');
const ListType = require('./list_type');
const List = mongoose.model('list');
const FunctionType = require('./function_type');
const Function = mongoose.model('function');

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    people: {
      type: new GraphQLList(PersonType),
      resolve() {
        return Person.find({});
      }
    },
    lists: {
      type: new GraphQLList(ListType),
      resolve() {
        return List.find({});
      }
    },
    searchPeople: {
      type: new GraphQLList(PersonType),
      args: {query: {type: new GraphQLNonNull(GraphQLString)}},
      resolve(parentValue, {query}) {
        return Person.search({query});
      }
    },
    person: {
      type: PersonType,
      args: {id: {type: new GraphQLNonNull(GraphQLID)}},
      resolve(parentValue, {id}) {
        return Person.findOne({_id: id});
      }
    },
    organizations: {
      type: new GraphQLList(OrganizationType),
      args: {},
      resolve(parentValue) {
        return Organization.find();
      }
    },
    organization: {
      type: OrganizationType,
      args: {id: {type: new GraphQLNonNull(GraphQLID)}},
      resolve(parentValue, {id}) {
        return Organization.findOne({_id: id});
      }
    },
    functionById: {
      type: FunctionType,
      args: {id: {type: new GraphQLNonNull(GraphQLID)}},
      resolve(parentValue, {id}) {
        return Function.findOne({_id: id});
      }
    }
  })
});

module.exports = RootQuery;

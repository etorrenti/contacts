const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLList, GraphQLID, GraphQLNonNull } = graphql;
const PersonType = require('./person_type');
const Person = mongoose.model('person');
const OrganizationType = require('./organization_type');
const Organization = mongoose.model('organization');
const ListType = require('./list_type');
const List = mongoose.model('list');

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
    organizations: {
      type: new GraphQLList(OrganizationType),
      args: {},
      resolve(parentValue) {
        return Organization.find();
      }
    }
  })
});

module.exports = RootQuery;

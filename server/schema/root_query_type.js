const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLList, GraphQLID, GraphQLNonNull } = graphql;
const PersonType = require('./person_type');
const Person = mongoose.model('person');
const OrganizationType = require('./organization_type');
const Organization = mongoose.model('organization');

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    people: {
      type: new GraphQLList(PersonType),
      resolve() {
        return Person.find({});
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

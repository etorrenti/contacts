const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID,GraphQLFloat, GraphQLList } = graphql;

const Organization = mongoose.model('organization');

const OrganizationType = new GraphQLObjectType({
  name:  'OrganizationType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    address: { type: GraphQLString},
    city: { type: GraphQLString},
    prov: { type: GraphQLString},
    state: { type: GraphQLString},
    location: {
      type: new GraphQLList(GraphQLFloat)
    }
  })
});

module.exports = OrganizationType;

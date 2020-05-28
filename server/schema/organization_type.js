const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID,GraphQLFloat, GraphQLList } = graphql;
const FunctionType = require('./function_type')
const Organization = mongoose.model('organization')

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
    },
    functions: {
      type: new GraphQLList(FunctionType),
      resolve(parentValue){
        return Organization.findFunctions(parentValue.id)
      }
    }
  })
});

module.exports = OrganizationType;

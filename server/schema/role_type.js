const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID } = graphql;
const PersonType = require('./person_type')

const RoleType = new GraphQLObjectType({
  name:  'RoleType',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    person: { type: PersonType }
  }),
  resolve(parentValue, x) {
    // console.log("XXXXXX", parentValue, x)
    return x
  }
});

module.exports = RoleType;

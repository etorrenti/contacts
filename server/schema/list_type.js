// const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

const PersonType = require('./person_type');
// const List = mongoose.model('list');

const ListType = new GraphQLObjectType({
  name:  'ListType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    people: {
      type: new GraphQLList(PersonType),
      // resolve(parentValue) {
      //   return parentValue.contacts;
      // }
    }
  })
});

module.exports = ListType;

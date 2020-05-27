// const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

const ContactType = require('./contact_type');
// const List = mongoose.model('list');

const FunctionType = new GraphQLObjectType({
  name:  'FunctionType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    contacts: {
      type: new GraphQLList(ContactType),
    }
  })
});

module.exports = FunctionType;

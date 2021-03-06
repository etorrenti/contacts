// const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

const ContactType = new GraphQLObjectType({
  name:  'ContactType',
  fields: () => ({
    id: { type: GraphQLID },
    contactType: { type: GraphQLString },
    value: { type: GraphQLString },
  })
});

module.exports = ContactType;

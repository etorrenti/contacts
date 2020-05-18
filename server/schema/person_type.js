// const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

const ContactType = require('./contact_type');
// const Person = mongoose.model('person');

const PersonType = new GraphQLObjectType({
  name:  'PersonType',
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    title: { type: GraphQLString },
    contacts: {
      type: new GraphQLList(ContactType),
      resolve(parentValue) {
        return parentValue.contacts;
      }
    }
  })
});

module.exports = PersonType;

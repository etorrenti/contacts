const graphql = require('graphql');
const {GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLID, GraphQLNonNull} = graphql;
const mongoose = require('mongoose');
const Organization = mongoose.model('organization');
const OrganizationType = require('./organization_type');
const Person = mongoose.model('person');
const PersonType = require('./person_type');

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addOrganization: {
      type: OrganizationType,
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString)
        },
        address: {
          type: GraphQLString
        },
        city: {
          type: GraphQLString
        },
        prov: {
          type: GraphQLString
        },
        state: {
          type: GraphQLString
        },
        lat: {
          type: GraphQLFloat
        },
        lon: {
          type: GraphQLFloat
        }
      },
      resolve(parentValue, {name, address, city, prov, state, lat, lon}) {
        let location = [0.0, 0.0];
        if(lat && lon) {
          location = [lon, lat];
        }
        return (new Organization({
          name,
          address,
          city,
          prov,
          state,
          location
        })).save()
      }
    },
    addPerson: {
      type: OrganizationType,
      args: {
        firstName : {type: new GraphQLNonNull(GraphQLString)},
        lastName : {type: new GraphQLNonNull(GraphQLString)},
        contact : {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(parentValue, {firstName, lastName, contact, organizationId, role}) {

      }
    }
  }
});

module.exports = mutation;

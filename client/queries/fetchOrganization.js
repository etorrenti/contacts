import gql from 'graphql-tag'

export default gql`
query Organization($id: ID!){
  organization(id: $id){
    id, description, name, address, city, prov, state, location, functions {
      id, name, description, contacts{
        id, contactType, value
      }
    },
    roles {
      id, title, person {
        id, firstName, lastName
      }
    }
  }
}
`

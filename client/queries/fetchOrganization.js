import gql from 'graphql-tag'

export default gql`
query Organization($id: ID!){
  organization(id: $id){
    id, name, address, city, prov, state, location, functions {
      id, name, description, contacts{
        type, value
      }
    }
  }
}
`

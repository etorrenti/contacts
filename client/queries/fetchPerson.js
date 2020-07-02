import gql from 'graphql-tag'

export default gql`
query Person($id: ID!){
  person(id: $id){
    id, firstName, lastName, title, contacts{
      id, contactType, value
    }
  }
}
`

import gql from 'graphql-tag'

export default gql`
query SearchPeople($query: String!){
  searchPeople(query: $query){
    id, firstName, lastName
  }
}
`

import gql from 'graphql-tag'

export default gql`
query {
  people {
    id,
    firstName,
    lastName
  }
}
`

import gql from 'graphql-tag'

export default gql`
query {
  organizations {
    id, name, description, address, city, prov, state
  }
}
`

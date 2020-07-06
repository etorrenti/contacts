import gql from 'graphql-tag'

export default gql`query FunctionById($functionId: ID!){
  functionById(id: $functionId){
    id, name, description, contacts{
      id, contactType, value
    }
  }
}`

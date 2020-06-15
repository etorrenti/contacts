import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Link, hashHistory} from 'react-router';

import fetchFunction from '../queries/fetchFunction'
import fetchOrganization from '../queries/fetchOrganization'

class CreateFunctionContact extends Component {
  constructor(){
    super()
    this.state = {
      value: "",
      type: "TELEPHONE"
    }
  }

  onSubmit(e) {
    console.log(this)
    e.preventDefault();

    this.props.mutate({
      variables: {
        contact: this.state.value,
        contactType: this.state.type,
        functionId: this.props.params.fId
      },
      refetchQueries: [{query: fetchOrganization, variables: {id: this.props.params.id}}]
    })
    .then(() => hashHistory.push(`/organization/${this.props.params.id}`));
  }

  render() {
    console.log(this)
    const {functionById} = this.props.data;
    let children = [];
    if(functionById){
      children = [<h3>Crea nuovo contatto per {functionById.name}</h3>,
      <form onSubmit={this.onSubmit.bind(this)}>
        <label>Contatto:</label>
        <input onChange={event => this.setState({value: event.target.value})} value={this.state.value}/>
        <input id="submit_handle" type="submit" style={{display: "none"}} />
      </form>]
    } else {
      children = <div>Funzione non trovata</div>
    }
    return (<div>
      <Link to={`/organization/${this.props.params.id}`}>Indietro</Link>
      { children }
    </div>);
  }
}

const mutation = gql `
  mutation AddContactToFunction($functionId: ID!, $contact: String!, $contactType: String!){
    addContactToFunction(functionId: $functionId, contact: $contact, contactType: $contactType){
      id, contacts{
        contactType, value
      }
    }
  }
`;

export default graphql(mutation)(graphql(fetchFunction, {
  options: (props) => {return { variables: {functionId: props.params.fId}}}
})(CreateFunctionContact));

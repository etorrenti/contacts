import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Link, hashHistory} from 'react-router';

import fetchPerson from '../queries/fetchPerson'

class CreatePersonContact extends Component {
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
        personId: this.props.params.id
      },
      refetchQueries: [{query: fetchPerson, variables: {id: this.props.params.id}}]
    })
    .then(() => hashHistory.push(`/person/${this.props.params.id}`));
  }

  render() {
    // console.log(this.state)
    const {person} = this.props.data
    let children = [];
    if(person){
      children = [<h3>Crea nuovo contatto per {person.firstName} {person.lastName}</h3>,
      <form onSubmit={this.onSubmit.bind(this)}>
        <label>Contatto:</label>
        <input onChange={event => this.setState({value: event.target.value})} value={this.state.value}/>
        <input id="submit_handle" type="submit" style={{display: "none"}} />
      </form>]
    } else {
      children = <div>Persona non trovata</div>
    }
    return (<div>
      <Link to={`/person/${this.props.params.id}`}>Indietro</Link>
      { children }
    </div>);
  }
}

const mutation = gql `
  mutation AddContactToPerson($personId: ID!, $contact: String!, $contactType: String!){
    addContactToPerson(personId: $personId, contact: $contact, contactType: $contactType){
      id, contacts{
        contactType, value
      }
    }
  }
`;

export default graphql(mutation)(graphql(fetchPerson, {
  options: (props) => { return  { variables: {id: props.params.id}}}
})(CreatePersonContact));

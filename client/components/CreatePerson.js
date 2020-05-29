import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Link, hashHistory} from 'react-router';

import query from '../queries/fetchPeople';

class CreatePerson extends Component {
  constructor(){
    super()
    this.state = {
      firstName: "",
      lastName: "",
      contact: "",
      type: "TELEPHONE",
    }
  }

  onSubmit(e) {
    e.preventDefault();

    this.props.mutate({
      variables: {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        contact: this.state.contact,
        contactType: this.state.type
      },
      refetchQueries: [{query: query}]
    })
    .then(() => hashHistory.push("/"));
  }

  render() {
    // console.log(this.state)
    return (<div>
      <Link to="/">Indietro</Link>
      <h3>Crea nuova persona</h3>
      <form onSubmit={this.onSubmit.bind(this)}>
        <label>Nome:</label>
        <input onChange={event => this.setState({firstName: event.target.value})} value={this.state.firstName}/>
        <label>Cognome:</label>
        <input onChange={event => this.setState({lastName: event.target.value})} value={this.state.lastName}/>
        <label>Contatto:</label>
        <input onChange={event => this.setState({contact: event.target.value})} value={this.state.contact}/>
        <input id="submit_handle" type="submit" style={{display: "none"}} />
      </form>
    </div>);
  }
}

const mutation = gql `
mutation AddPerson($firstName: String!, $lastName: String!, $contact: String!, $contactType: String!) {
  addPerson(firstName: $firstName, lastName: $lastName, contact: $contact, contactType: $contactType) {
    id
  }
}
`;

export default graphql(mutation)(CreatePerson);

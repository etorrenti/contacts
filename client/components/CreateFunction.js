import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Link, hashHistory} from 'react-router';

import fetchOrganization from '../queries/fetchOrganization'

class CreateFunction extends Component {
  constructor(){
    super()
    this.state = {
      name: "",
      description: ""
    }
  }

  onSubmit(e) {
    console.log(this)
    e.preventDefault();

    this.props.mutate({
      variables: {
        organizationId: this.props.params.id,
        name: this.state.name,
        description: this.state.description
      },
      refetchQueries: [{query: fetchOrganization, variables: {id: this.props.params.id}}]
    })
    .then(() => hashHistory.push(`/organization/${this.props.params.id}`));
  }

  render() {
    // console.log(this.state)
    return (<div>
      <Link to="/">Indietro</Link>
      <h3>Crea nuova funzione</h3>
      <form onSubmit={this.onSubmit.bind(this)}>
        <label>Nome:</label>
        <input onChange={event => this.setState({name: event.target.value})} value={this.state.name}/>
        <label>Descrizione:</label>
        <input onChange={event => this.setState({description: event.target.value})} value={this.state.description}/>
        <input id="submit_handle" type="submit" style={{display: "none"}} />
      </form>
    </div>);
  }
}

const mutation = gql `
  mutation AddFunction($organizationId: ID!, $name: String!, $description: String){
    addFunction(organizationId: $organizationId, name: $name, description: $description) {
      id, name
    }
  }
`;

export default graphql(mutation)(CreateFunction);

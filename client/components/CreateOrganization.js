import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Link, hashHistory} from 'react-router';

import query from '../queries/fetchOrganizations';

class CreateOrganization extends Component {
  constructor(){
    super()
    this.state = {
      name: ""
    }
  }

  onSubmit(e) {
    e.preventDefault();

    this.props.mutate({
      variables: {
        name: this.state.name
      },
      refetchQueries: [{query: query}]
    })
    .then(() => hashHistory.push("/"));
  }

  render() {
    // console.log(this.state)
    return (<div>
      <Link to="/">Indietro</Link>
      <h3>Crea nuova organizzazione</h3>
      <form onSubmit={this.onSubmit.bind(this)}>
        <label>Nome:</label>
        <input onChange={event => this.setState({name: event.target.value})} value={this.state.name}/>
        <input id="submit_handle" type="submit" style={{display: "none"}} />
      </form>
    </div>);
  }
}

const mutation = gql `
  mutation AddOrganization($name: String!){
    addOrganization(name: $name){
      id,
      name
    }
  }
`;

export default graphql(mutation)(CreateOrganization);

import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Link, hashHistory} from 'react-router';

import query from '../queries/fetchLists';

class CreateList extends Component {
  constructor(){
    super()
    this.state = {
      name: "",
      description: "",
    }
  }

  onSubmit(e) {
    console.log("XXX", e)
    e.preventDefault();

    this.props.mutate({
      variables: {
        name: this.state.name,
        description: this.state.description,
      },
      refetchQueries: [{query: query}]
    })
    .then(() => hashHistory.push("/"))
    .catch((e) => console.log(e));
  }

  render() {
    // console.log(this.state)
    return (<div>
      <Link to="/">Indietro</Link>
      <h3>Crea nuova lista</h3>
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
  mutation AddList($name: String!, $description: String){
    addList(name: $name, description: $description){
      id,
      name,
      description
    }
  }
`;

export default graphql(mutation)(CreateList);

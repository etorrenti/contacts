import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Link} from 'react-router';

import query from '../queries/fetchPeople';

import EditPersonDialog from './EditPersonDialog'
import ConfirmationDialog from './ConfirmationDialog'

class PeopleList extends Component {
  constructor() {
    super();
    this.state = {
      editDialogOpen: false,
      confirmDialogOpen: false,
      person: null,
      edit: false
    }
  }

  askDelete(x){
    this.setState({
      person: x,
      confirmDialogOpen: true
    });
  }

  onDelete(x){
    this.props.mutate({
      variables: {
        id: x.id
      },
      refetchQueries: [{query: query}]
    })
    .catch((e) => console.log(e));

    this.setState({
      confirmDialogOpen: false,
      person: null
    })
  }

  renderPerson(x) {
    return <li className="collection-item" key={x.id}>
      <Link to={`/person/${x.id}`}>{x.firstName} {x.lastName}</Link>
       <i className="material-icons" onClick={ () => this.askDelete(x) }>delete</i>
       <i className="material-icons" onClick={ () => this.editPerson(x) }>edit</i>
      </li>
  }

  newPerson() {
    console.log("new person", this)
    this.setState({
      edit: false,
      editDialogOpen: true,
      person: null
    })
  }

  editPerson(person) {
    console.log("edit person", person)
    this.setState({
      edit: true,
      editDialogOpen: true,
      person: person
    })
  }

  closeEditDialog() {
    this.setState({
      editDialogOpen: false
    })
  }

  deletionConfirmMessage(){
    if(!this.state.person){
      return null;
    }
    const {person} = this.state;
    return `Vuoi davvero eliminare ${person.firstName} ${person.lastName}?`;
  }

  renderOuter(children){
    return (
      <div>
        <h2>Persone
        &nbsp;
        <a className="btn-floating btn-medium waves-effect waves-light red" onClick= { () => this.newPerson() }>
          <i className="material-icons">add</i>
        </a>
        </h2>
        {children}
        <EditPersonDialog
          open = { this.state.editDialogOpen }
          onClose = { () => this.closeEditDialog() }
          edit = { this.state.edit }
          person = { this.state.person } />

        <ConfirmationDialog
          title = "Conferma eliminazione di persona"
          open = { this.state.confirmDialogOpen }
          token = { this.state.person }
          onYes = { (person) => this.onDelete(person) }
          onNo = { () => this.setState({confirmDialogOpen: false}) } >
          { this.deletionConfirmMessage() }
        </ConfirmationDialog>
      </div>
    );
  }

  render() {
    let children = [];
    if (!this.props.data.loading) {
      children = <div>
        <ul className="collection">
          {this.props.data.people.map(x => this.renderPerson(x))}
        </ul>
      </div>
    } else {
      children =  <div className="progress">
        <div className="indeterminate"></div>
      </div>
    }

    return this.renderOuter(children);
  }
}

const mutation = gql`
  mutation DeletePerson($id: ID!){
    deletePerson(id: $id){
      id
    }
  }
`;
export default graphql(mutation)(graphql(query)(PeopleList));

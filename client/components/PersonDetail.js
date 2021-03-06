import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Link, hashHistory} from 'react-router';

import EditPersonDialog from './EditPersonDialog'
import EditContactDialog from './EditContactDialog'
import ConfirmationDialog from './ConfirmationDialog'

import fetchPerson from '../queries/fetchPerson'

class PersonDetail extends Component {
  constructor() {
    super();
    this.state = {
      editPersonDialogOpen: false,
      editContactDialogOpen: false,
      editContact: false,
      confirmDialogOpen: false,
      contact: null
    }
  }

  closeEditDialog() {
    this.setState({
      editPersonDialogOpen: false
    })
  }

  closeEditContactDialog() {
    this.setState({
      editContactDialogOpen: false
    })
  }

  editPerson() {
    console.log("edit person", this.props.data.person)
    this.setState({
      editPersonDialogOpen: true,
    })
  }

  editContact(i) {
    let {contacts} = this.props.data.person;
    if(!contacts || !contacts.length || contacts.length <= i){
      return;
    }

    let contact = contacts[i];
    console.log("edit contact", this.props.data.person.id, contact)
    this.setState({
      editContactDialogOpen: true,
      editContact: true,
      contact: contact
    })
  }

  newContact() {
    console.log("new contact", this.props.data.person.id)
    this.setState({
      editContactDialogOpen: true,
      editContact: false,
      contact: null
    })
  }

  askDelete(i){
    let {contacts} = this.props.data.person;
    if(!contacts || !contacts.length || contacts.length <= i){
      return;
    }

    let c = contacts[i];

    this.setState({
      contact: c,
      confirmDialogOpen: true
    });
  }

  onDelete(c) {
    console.log("On delete", c, this)

    this.props.mutate({
      variables: {
        personId: this.props.params.id,
        contact: c.value,
        contactType: c.contactType
      },
      refetchQueries: [{query: fetchPerson, variables: {id: this.props.params.id}}]
    })
    .catch((e) => console.log(e));
  }

  renderContactTable(){
    let contacts = this.props.data.person.contacts;
    return(
      <table className="striped">
        <thead>
          <tr>
            <th>Contatto</th>
            <th>Tipo</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
        { contacts.map((c, i) => {
          return (
            <tr key={i}>
              <td>{c.value}</td>
              <td>{c.contactType}</td>
              <td>
                <i className="material-icons pointer" onClick={() => this.editContact(i) }>edit</i>
                <i className="material-icons pointer" onClick={() => this.askDelete(i) }>delete</i>
              </td>
            </tr>
          );
        }) }
        </tbody>
      </table>
    );
  }

  deletionConfirmMessage(){
    if(!this.state.contact){
      return null;
    }
    const {contact} = this.state;
    return `Vuoi davvero eliminare ${contact.value} (${contact.contactType})?`;
  }

  renderPerson(person) {
    if (person) {
      return (
        <div>
          <h3>
            { person.title ? person.title + " ": ""}{person.firstName} {person.lastName}
            &nbsp;
            <a className="btn-floating btn-small waves-effect waves-light red" onClick={ (e) => e.preventDefault() }>
              <i className="material-icons pointer" onClick={ () => this.editPerson(person) }>edit</i>
            </a>
          </h3>
          { (person.contacts && person.contacts.length && person.contacts.length > 0) ? this.renderContactTable() : [] }

          <a className="btn-floating btn-medium waves-effect waves-light red" onClick={ () => this.newContact() }>
            <i className="material-icons">add</i>
          </a>

          <EditPersonDialog
            open = { this.state.editPersonDialogOpen }
            onClose = { () => this.closeEditDialog() }
            edit = { true }
            person = { person } />

          <EditContactDialog
            open = { this.state.editContactDialogOpen }
            onClose = { () => this.closeEditContactDialog() }
            edit = { this.state.editContact }
            personId={ person.id }
            contactObj = { this.state.contact } />

          <ConfirmationDialog
            title = "Conferma eliminazione di contatto"
            open = { this.state.confirmDialogOpen }
            token = { this.state.contact }
            onYes = { (contact) => this.onDelete(contact) }
            onNo = { () => this.setState({confirmDialogOpen: false}) } >
            { this.deletionConfirmMessage() }
          </ConfirmationDialog>
        </div>
      );
    } else {
      return (<div className="error">
        Persona non trovata
      </div>)
    }
  }

  render() {
    if(this.props.data.loading){
      return (
        <div className="progress">
          <div className="indeterminate"></div>
        </div>
      );
    }

    const {person} = this.props.data;

    return (
      <div className="row">
        <Link to="/">Indietro</Link>
        { this.renderPerson(person) }
      </div>
    );
  }
}

const mutation = gql`
  mutation DeleteContactInPerson($personId: ID!, $contact: String!, $contactType: String){
    deleteContactInPerson(personId: $personId, contact: $contact, contactType: $contactType){
      id, contacts {
        contactType, value
      }
    }
  }
`;

export default graphql(mutation)(graphql(fetchPerson, {
  options: (props) => { return  { variables: {id: props.params.id}}}
})(PersonDetail));

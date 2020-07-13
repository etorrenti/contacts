import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Link, hashHistory} from 'react-router';
import query from '../queries/fetchOrganization'
import { compose } from 'recompose'

import ConfirmationDialog from './ConfirmationDialog'
import EditFunctionDialog from './EditFunctionDialog'

class OrganizationFunctionDetail extends Component {
  constructor() {
    super();
    this.state = {
      editFunctionDialogOpen: false,
      editContactDialogOpen: false,
      confirmFunctionDialogOpen: false,
      confirmContactDialogOpen: false,
      theFunction: null,
      contact: -1,
      editFunction: false,
      editContact: false
    }
  }

  askDeleteFunction(x){
    this.setState({
      theFunction: x,
      confirmFunctionDialogOpen: true
    });
  }

  askDeleteContact(x){
    this.setState({
      contact: x,
      confirmContactDialogOpen: true
    });
  }

  addFunction(){
    this.setState({
      editFunctionDialogOpen: true,
      editFunction: false,
      theFunction: null
    });
  }

  editFunction(x) {
    this.setState({
      editFunctionDialogOpen: true,
      editFunction: true,
      theFunction: x
    });
  }

  closeEditFunctionDialog() {
    this.setState({
      editFunctionDialogOpen: false
    })
  }

  onDelete(x) {
    this.props.deleteFunction({
      variables: {
        functionId: x.id,
        organizationId: this.props.organizationId
      },
      refetchQueries: [{query: query, variables: {
        id: this.props.organizationId
      }}]
    })
    .catch((e) => console.log(e));

    this.setState({
      confirmFunctionDialogOpen: false,
      theFunction: null
    })
  }

  onDeleteContact(i) {
    let {contacts} = this.props.data;
    if(!contacts || !contacts.length || contacts.length <= i){
      return;
    }

    let c = contacts[i];

    this.props.deleteContact({
      variables: {
        functionId: this.props.data.id,
        contact: c.value,
        contactType: c.contactType
      },
      refetchQueries: [{query: query, variables: {
        id: this.props.organizationId
      }}]
    })
    .catch((e) => console.log(e));

    this.setState({
      confirmContactDialogOpen: false,
      contact: -1
    })
  }

  renderContact(contact, index){
    return <li className="collection-item" key={`contact_${this.props.data.id}_${index}`}>
      { contact.value } ({ contact.contactType })
      <i onClick={ () => this.askDeleteContact(index)} className="material-icons pointer">delete</i>
    </li>
  }

  renderContacts() {
    let {contacts} = this.props.data;
    if(!contacts || !contacts.length || contacts.length < 1){
      return null;
    }

    return <ul className="collection contacts">
      { contacts.map( (c, i) => this.renderContact(c, i)) }
    </ul>
  }

  functionDeletionConfirmMessage() {
    if(!this.state.theFunction){
      return ""
    }
    return `Vuoi eliminare la funzione ${this.state.theFunction.name}?`;
  }

  contactDeletionConfirmMessage() {
    if( this.state.contact < 0 || this.state.contact >= this.props.data.contacts.length){
      return ""
    }
    const k = this.props.data.contacts[this.state.contact];
    return `Vuoi eliminare ${k.value}(${k.contactType})?`;
  }

  render() {
    return (
      <div className="card small">
        <div className="card-content">
          <span className="card-title">
            {this.props.data.name} &nbsp;
            <Link className="btn-floating btn-small waves-effect waves-light red"
              to={`/organization/${this.props.organizationId}/functions/${this.props.data.id}/contacts/new`}>
              <i className="material-icons">add</i>
            </Link>
          </span>
          { this.renderContacts() }
        </div>
        <div className="card-action">
          <i onClick={ () => this.askDeleteFunction(this.props.data)} className="material-icons pointer">delete</i>
          <i onClick={ () => this.editFunction(this.props.data)} className="material-icons pointer">edit</i>
        </div>
        <ConfirmationDialog
          id = "confirmFunctionDialog"
          title = "Conferma eliminazione di funzione"
          open = { this.state.confirmFunctionDialogOpen }
          token = { this.state.theFunction }
          onYes = { (theFunction) => this.onDelete(theFunction) }
          onNo = { () => this.setState({confirmFunctionDialogOpen: false}) } >
          { this.functionDeletionConfirmMessage() }
        </ConfirmationDialog>
        <ConfirmationDialog
          id = "confirmContactDialog"
          title = "Conferma eliminazione di contatto"
          open = { this.state.confirmContactDialogOpen }
          token = { this.state.contact }
          onYes = { (index) => this.onDeleteContact(index) }
          onNo = { () => this.setState({confirmContactDialogOpen: false}) } >
          { this.contactDeletionConfirmMessage() }
        </ConfirmationDialog>
        <EditFunctionDialog
          open = { this.state.editFunctionDialogOpen }
          onClose = { () => this.closeEditFunctionDialog() }
          edit = { this.state.editFunction }
          organizationId = { this.props.organizationId }
          funct = { this.state.theFunction } />
      </div>
    );
  }
}

const deleteFunction = gql`
    mutation DeleteFunction($organizationId: ID!, $functionId: ID!){
    deleteFunction(organizationId: $organizationId, functionId: $functionId){
      id, name
    }
  }
`
const deleteContact = gql`
  mutation DeleteContactInFunction($functionId: ID!, $contact: String!, $contactType: String!){
    deleteContactInFunction(functionId: $functionId, contact: $contact, contactType: $contactType){
      id, contacts {
        contactType, value
      }
    }
  }
`

export default compose(
  graphql(deleteFunction, {name: 'deleteFunction'}),
  graphql(deleteContact, {name: 'deleteContact'}))(OrganizationFunctionDetail);

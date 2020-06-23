import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Link, hashHistory} from 'react-router';
import query from '../queries/fetchOrganization'
import { compose } from 'recompose'

class OrganizationFunctionDetail extends Component {
  onDelete(x) {
    this.props.mutate({
      variables: {
        functionId: x.id,
        organizationId: this.props.organizationId
      },
      refetchQueries: [{query: query, variables: {
        id: this.props.organizationId
      }}]
    })
    .catch((e) => console.log(e));
  }

  onDeleteContact(i) {
    console.log("On delete", i, this)
    let {contacts} = this.props.data;
    if(!contacts || !contacts.length || contacts.length <= i){
      return;
    }

    let c = contacts[i];
    console.log(c)

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
  }

  renderContact(contact, index){
    return <li className="collection-item" key={`contact_${this.props.data.id}_${index}`}>
      { contact.value } ({ contact.contactType })
      <i onClick={ () => this.onDeleteContact(index)} className="material-icons pointer">delete</i>
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
          <i onClick={ () => this.onDelete(this.props.data)} className="material-icons pointer">delete</i>
        </div>
      </div>
    );
  }
}

const mutation = gql`
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
  graphql(mutation),
  graphql(deleteContact, {name: 'deleteContact'}))(OrganizationFunctionDetail);

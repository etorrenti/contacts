import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Link, hashHistory} from 'react-router';
import query from '../queries/fetchOrganization'

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

  onDeleteContact(index) {
    //TODO:
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

    return <ul className="collection">
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

export default graphql(mutation)(OrganizationFunctionDetail);

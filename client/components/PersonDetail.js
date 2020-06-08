import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Link, hashHistory} from 'react-router';

import OrganizationFunctions from './OrganizationFunctions'

import fetchPerson from '../queries/fetchPerson'

class PersonDetail extends Component {

  onDelete(i) {
    console.log("On delete", i, this)
    let {contacts} = this.props.data.person;
    if(!contacts || !contacts.length || contacts.length <= i){
      return;
    }

    let c = contacts[i];
    console.log(c)

    this.props.mutate({
      variables: {
        personId: this.props.params.id,
        contact: c.value,
        contactType: c.contactType
      },
      refetchQueries: [{query: fetchPerson}]
    })
    .catch((e) => console.log(e));
  }

  onEdit(i) {
    console.log("On edit", i)
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
                <i className="material-icons pointer" onClick={() => this.onEdit(i) }>edit</i>
                <i className="material-icons pointer" onClick={() => this.onDelete(i) }>delete</i>
              </td>
            </tr>
          );
        }) }
        </tbody>
      </table>
    );
  }

  renderPerson(person) {
    if (person) {
      return (
        <div>
          <h3>{person.firstName} {person.lastName}</h3>
          { (person.contacts && person.contacts.length && person.contacts.length > 0) ? this.renderContactTable() : [] }
          <Link className="btn-floating btn-medium waves-effect waves-light red" to={`/person/${person.id}/contacts/new`}>
            <i className="material-icons">add</i>
          </Link>
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

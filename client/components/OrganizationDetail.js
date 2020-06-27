import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Link, hashHistory} from 'react-router';

import OrganizationFunctions from './OrganizationFunctions'
import OrganizationPeople from './OrganizationPeople'

import fetchOrganization from '../queries/fetchOrganization'
import fetchPeople from '../queries/fetchPeople'
import { compose } from 'recompose'

class OrganizationDetail extends Component {

  renderOrganization(organization) {
    if (organization) {
      console.log(this, organization)
      return (
        <div>
          <h3>{organization.name}</h3>
          <OrganizationFunctions data={organization.functions} organizationId={organization.id}></OrganizationFunctions>
          <OrganizationPeople data={ {roles: organization.roles, people: this.props.people.people} } organizationId={organization.id}></OrganizationPeople>
        </div>
      );
    } else {
      return (<div className="error">
        Organizzazione non trovata
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

    const {organization} = this.props.data;

    return (
      <div className="row">
        <Link to="/">Indietro</Link>
        { this.renderOrganization(organization) }
      </div>
    );
  }
}

export default compose(
  graphql(fetchPeople, {name: 'people'}),
  graphql(fetchOrganization, {
  options: (props) => { return  { variables: {id: props.params.id}}}
}))(OrganizationDetail)
;

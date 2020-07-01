import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Link, hashHistory} from 'react-router';

import EditOrganizationDialog from './EditOrganizationDialog'
import OrganizationFunctions from './OrganizationFunctions'
import OrganizationPeople from './OrganizationPeople'

import fetchOrganization from '../queries/fetchOrganization'
import fetchPeople from '../queries/fetchPeople'
import { compose } from 'recompose'

class OrganizationDetail extends Component {
  constructor() {
    super();
    this.state = {
      editDialogOpen: false,
    }
  }

  closeEditDialog() {
    this.setState({
      editDialogOpen: false
    })
  }

  editOrganization() {
    console.log("edit organization", this.props.data.organization)
    this.setState({
      editDialogOpen: true,
    })
  }

  renderInfo(organization) {
    const { description, address, city, prov, state} = organization;
    let children = [];

    if(description) {
      children.push(<p key="org_line_1">
        <em>{description}</em>
      </p>);
    }

    if(address || city || prov || state) {
      children.push(<p key="org_line_2">
        { address}{ city ? ` ${city}` : ""}{ prov ? ` (${prov})` : "" }{ state ? ` -  ${state}` : "" }
      </p>);
    }

    return children;
  }

  renderOrganization(organization) {
    if (organization) {
      return (
        <div>
          <h3>
            {organization.name} &nbsp;
            <a className="btn-floating btn-small waves-effect waves-light red" onClick={ (e) => e.preventDefault() }>
              <i className="material-icons pointer" onClick={ () => this.editOrganization(organization) }>edit</i>
            </a>
          </h3>
          { this.renderInfo(organization) }
          <OrganizationFunctions data={organization.functions} organizationId={organization.id}></OrganizationFunctions>
          <OrganizationPeople data={ {roles: organization.roles, people: this.props.people.people} } organizationId={organization.id}></OrganizationPeople>

          <EditOrganizationDialog
            open = { this.state.editDialogOpen }
            onClose = { () => this.closeEditDialog() }
            edit = { true }
            organization = { organization } />
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

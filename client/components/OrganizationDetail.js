import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Link, hashHistory} from 'react-router';

import OrganizationList from './OrganizationsList'
import ListList from './ListsList'
import fetchOrganization from '../queries/fetchOrganization'

class OrganizationDetail extends Component {

  renderOrganization(organization) {
    if (organization) {
      return (
        <h3>{organization.name}</h3>
      );
    } else {
      return (<div className="error">
        Organizzazione non trovata
      </div>)
    }
  }

  render() {
    console.log(this.props)

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

export default graphql(fetchOrganization, {
  options: (props) => { return  { variables: {id: props.params.id}}}
})(OrganizationDetail);

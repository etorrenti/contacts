import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Link} from 'react-router';

import OrganizationList from './OrganizationsList'
import ListList from './ListsList'

class OrganizationDetail extends Component {

  render() {
    if (this.props.org) {
      return (<div className="row">
        <h3>{this.props.org.name}</h3>
      </div>);
    } else {
      return (<div className="row">
        Organizzazione non trovata
      </div>)
    }
  }
}

export default OrganizationDetail;

import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Link} from 'react-router';

import query from '../queries/fetchOrganizations';

class OrganizationList extends Component {

  renderOrg(x) {
    return <li key={x.id}>{x.name}</li>
  }

  render() {
    if (!this.props.data.loading) {
      return <div>
        <ul>
          {this.props.data.organizations.map(x => this.renderOrg(x))}
        </ul>
        <Link to="/organizations/new">Aggiungi</Link>
      </div>
    } else {
      return <div>Loading...</div>
    }
  }
}

export default graphql(query)(OrganizationList);

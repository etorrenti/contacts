import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Link} from 'react-router';

import query from '../queries/fetchOrganizations';

class OrganizationList extends Component {

  renderOrg(x) {
    return <li className="collection-item" key={x.id}>
      <Link to={`/organization/${x.id}`}>{x.name}</Link>
       {/* <i className="material-icons">delete</i> */}
    </li>
  }

  renderOuter(children){
    return (
      <div>
        <h1>Lista Organizzazioni</h1>
        {children}
      </div>
    );
  }

  render() {
    let children = [];
    if (!this.props.data.loading) {
      children = <div>
        <ul className="collection">
          {this.props.data.organizations.map(x => this.renderOrg(x))}
        </ul>
        <Link className="btn-floating btn-large waves-effect waves-light red" to="/organization/new">
          <i className="material-icons">add</i>
        </Link>
      </div>
    } else {
      children =  <div className="progress">
        <div className="indeterminate"></div>
      </div>
    }

    return this.renderOuter(children);
  }
}

const mutation = gql`
mutation DeleteOrganization($id: ID!) {
  deleteOrganization(id: $id){
    id
  }
}
`;

export default graphql(mutation)(
  graphql(query)(OrganizationList));

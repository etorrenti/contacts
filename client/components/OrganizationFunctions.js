import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Link} from 'react-router';

import OrganizationFunctionDetail from './OrganizationFunctionDetail'
import query from '../queries/fetchOrganization'

class OrganizationFunctions extends Component {

  renderFunction(x) {
    return <div className="col s12 m4" key={x.id}>
      <OrganizationFunctionDetail data={x} organizationId= { this.props.organizationId }/>
    </div>
  }

  renderOuter(children){
    return (
      <div>
        <h4>
          Funzioni
          &nbsp;
          <Link to={`/organization/${this.props.organizationId}/functions/new`} className="btn-floating btn-small waves-effect waves-light red"><i className="material-icons">add</i></Link>
        </h4>
        {children}
      </div>
    );
  }

  render() {
    let children = [];
    if (!this.props.data.loading) {
      children = <div className="functions row">
        {this.props.data.map(x => this.renderFunction(x))}
      </div>
    } else {
      children =  <div className="progress">
        <div className="indeterminate"></div>
      </div>
    }

    return this.renderOuter(children);
  }
}

export default OrganizationFunctions;

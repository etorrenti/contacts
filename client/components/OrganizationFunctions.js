import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Link} from 'react-router';

import OrganizationFunctionDetail from './OrganizationFunctionDetail'

class OrganizationFunctions extends Component {

  renderFunction(x) {
    return <div className="function" key={x.id}>
      <OrganizationFunctionDetail data={x} />
       {/* <i className="material-icons">delete</i> */}
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
      children = this.props.data.map(x => this.renderFunction(x))
    } else {
      children =  <div className="progress">
        <div className="indeterminate"></div>
      </div>
    }

    return this.renderOuter(children);
  }
}


export default OrganizationFunctions;

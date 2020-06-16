import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Link} from 'react-router';

import query from '../queries/fetchOrganization'

class OrganizationPeople extends Component {

  renderPerson(x) {
    return <div className="col s12 m4" key={x.id}>
    </div>
  }

  renderOuter(children){
    return (
      <div>
        <h4>
          Ruoli
          &nbsp;
          <Link to={`/organization/${this.props.organizationId}/people/add`} className="btn-floating btn-small waves-effect waves-light red"><i className="material-icons">add</i></Link>
        </h4>
        {children}
      </div>
    );
  }

  render() {
    let children = [];
    const {data} = this.props;
    if (data && !data.loading) {
      children = <div className="people row">
        {this.props.data.map(x => this.renderPerson(x))}
      </div>
    } else if(data && data.loading){
      children =  <div className="progress">
        <div className="indeterminate"></div>
      </div>
    } else {
      children =  <div className="people row">
        Nessuno ancora inserito
      </div>
    }

    return this.renderOuter(children);
  }
}

export default OrganizationPeople;

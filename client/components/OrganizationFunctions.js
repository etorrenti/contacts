import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Link} from 'react-router';

import OrganizationFunctionDetail from './OrganizationFunctionDetail'
import query from '../queries/fetchOrganization'

class OrganizationFunctions extends Component {
  onDelete(x) {
    this.props.mutate({
      variables: {
        functionId: x.id,
        organizationId: this.props.organizationId
      },
      refetchQueries: [{query: query, variables: {
        id: this.props.organizationId
      }}]
    })
    .catch((e) => console.log(e));
  }

  renderFunction(x) {
    return <li className="function collection-item" key={x.id}>
      <OrganizationFunctionDetail data={x} />
       <i onClick={ () => this.onDelete(x)} className="material-icons">delete</i>
    </li>
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
      children = <ul className="collection">
        {this.props.data.map(x => this.renderFunction(x))}
      </ul>
    } else {
      children =  <div className="progress">
        <div className="indeterminate"></div>
      </div>
    }

    return this.renderOuter(children);
  }
}

const mutation = gql`
    mutation DeleteFunction($organizationId: ID!, $functionId: ID!){
    deleteFunction(organizationId: $organizationId, functionId: $functionId){
      id, name
    }
  }
`

export default graphql(mutation)(OrganizationFunctions);

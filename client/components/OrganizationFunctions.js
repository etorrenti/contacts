import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Link} from 'react-router';

import OrganizationFunctionDetail from './OrganizationFunctionDetail'
import EditFunctionDialog from './EditFunctionDialog'
import query from '../queries/fetchOrganization'

class OrganizationFunctions extends Component {
  constructor() {
    super();
    this.state = {
      editFunctionDialogOpen: false
    }
  }

  editFunction(x) {
    this.setState({
      editFunctionDialogOpen: true
    });
  }

  closeEditFunctionDialog() {
    this.setState({
      editFunctionDialogOpen: false
    })
  }

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
          <a onClick={ () => this.editFunction() } className="btn-floating btn-small waves-effect waves-light red"><i className="material-icons">add</i></a>
        </h4>
        {children}
        <EditFunctionDialog
          open = { this.state.editFunctionDialogOpen }
          onClose = { () => this.closeEditFunctionDialog() }
          edit = { false }
          organizationId = { this.props.organizationId }
          funct = { null } />
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

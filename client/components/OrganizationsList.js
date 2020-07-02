import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Link} from 'react-router';

import EditOrganizationDialog from './EditOrganizationDialog'
import ConfirmationDialog from './ConfirmationDialog'

import query from '../queries/fetchOrganizations';

class OrganizationList extends Component {
  constructor() {
    super();
    this.state = {
      editDialogOpen: false,
      confirmDialogOpen: false,
      organization: null,
      edit: false
    }
  }

  askDelete(x){
    this.setState({
      organization: x,
      confirmDialogOpen: true
    });
  }

  onDelete(x){
    this.props.mutate({
      variables: {
        id: x.id
      },
      refetchQueries: [{query: query}]
    })
    .catch((e) => console.log(e));

    this.setState({
      confirmDialogOpen: false,
      organization: null
    })
  }

  renderOrg(x) {
    return <li className="collection-item" key={x.id}>
      <Link to={`/organization/${x.id}`}>{x.name}</Link>
       <i onClick={ () => this.askDelete(x) } className="material-icons">delete</i>
       <i onClick={ () => this.editOrganization(x) } className="material-icons">edit</i>
    </li>
  }

  newOrganization() {
    console.log("new organization", this)
    this.setState({
      edit: false,
      editDialogOpen: true,
      organization: null
    })
  }

  editOrganization(organization) {
    console.log("edit organization", organization)
    this.setState({
      edit: true,
      editDialogOpen: true,
      organization: organization
    })
  }

  closeEditDialog() {
    this.setState({
      editDialogOpen: false
    })
  }

  deletionConfirmMessage(){
    if(!this.state.organization){
      return null;
    }
    const {organization} = this.state;
    return `Vuoi davvero eliminare ${organization.name}?`;
  }

  renderOuter(children){
    return (
      <div>
        <h2>Organizzazioni
        &nbsp;
        <a className="btn-floating btn-medium waves-effect waves-light red" onClick={ () => this.newOrganization() }>
          <i className="material-icons">add</i>
        </a>
        </h2>
        {children}
        <EditOrganizationDialog
          open = { this.state.editDialogOpen }
          onClose = { () => this.closeEditDialog() }
          edit = { this.state.edit }
          organization = { this.state.organization } />

          <ConfirmationDialog
            title = "Conferma eliminazione di organizzazione"
            open = { this.state.confirmDialogOpen }
            token = { this.state.organization }
            onYes = { (organization) => this.onDelete(organization) }
            onNo = { () => this.setState({confirmDialogOpen: false}) } >
            { this.deletionConfirmMessage() }
          </ConfirmationDialog>
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

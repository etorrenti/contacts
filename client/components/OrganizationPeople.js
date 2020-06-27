import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Link} from 'react-router';
import { compose } from 'recompose'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import AddRoleDialog from './AddRoleDialog'

import query from '../queries/fetchOrganization'
import peopleQuery from '../queries/fetchPeople'

class OrganizationPeople extends Component {
  constructor(){
    super()
    this.state = {
      addRoleOpen: false
    }
  }

  addPerson(e){
    e.preventDefault()
    this.setState({
      addRoleOpen: true
    })
  }

  renderRoleOwner(role){
    const {person} = role;
    if(person) {
      return `${person.firstName} ${person.lastName}`;
    } else {
      return "-";
    }
  }

  renderPerson(x, i) {
    return <TableRow key={i}>
      <TableCell>{ x.title }</TableCell>
      <TableCell>{ this.renderRoleOwner(x) }</TableCell>
      <TableCell>
        <i onClick={ () => this.deleteRole(x) } className="material-icons pointer">delete</i>
      </TableCell>
    </TableRow>
  }

  handleAddRole(x) {
    console.log("Add role", x)
    this.closeAddRoleDialog()
    this.props.addRole({
      variables: {
        title: x.role,
        personId: x.person ? x.person.id : null,
        organizationId: this.props.organizationId
      },
      refetchQueries: [{query: query, variables: {
        id: this.props.organizationId
      }}]
    })
    .catch((e) => console.log(e));
  }

  deleteRole(role){
    console.log("Delete role", role)
    this.props.deleteRole({
      variables: {
        title: role.title,
        personId: role.person ? role.person.id : null,
        organizationId: this.props.organizationId
      },
      refetchQueries: [{query: query, variables: {
        id: this.props.organizationId
      }}]
    })
    .catch((e) => console.log(e));
  }

  closeAddRoleDialog(){
    this.setState({
      addRoleOpen: false
    })
  }

  renderOuter(children){
    console.log(this)
    return (
      <div>
        <h4>
          Ruoli
          &nbsp;
          <a className="btn-floating btn-small waves-effect waves-light red" href="#" onClick={ (e) => this.addPerson(e) }>
            <i className="material-icons">add</i>
          </a>
        </h4>
        {children}
        <AddRoleDialog open={ this.state.addRoleOpen }
          addCallback= { (x) => this.handleAddRole(x)}
          cancelCallback= { () => this.closeAddRoleDialog()}
          people={ this.props.data.people }
        />
      </div>
    );
  }

  render() {
    console.log("XXX", this)
    let children = [];
    const {roles} = (this.props.data) || [];
    if (roles) {
      children = <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow key="role-header">
            <TableCell>Denominazione</TableCell>
            <TableCell>Titolare</TableCell>
            <TableCell>Azioni</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { this.props.data.roles.map((x, i) => this.renderPerson(x, i)) }
        </TableBody>
      </Table>
    </TableContainer>
    } else {
      children =  <div className="people row">
        Nessuno ancora inserito
      </div>
    }

    return this.renderOuter(children);
  }
}

const addRole = gql`
  mutation AddRole($organizationId: ID!, $title: String!, $personId: ID) {
    addRole(organizationId: $organizationId, title: $title, personId: $personId) {
      roles {
        title
        person {
          id
          firstName
          lastName
        }
      }
    }
  }
`
const deleteRole = gql`
  mutation DeleteRole($organizationId: ID!, $title: String!, $personId: ID) {
    deleteRole(organizationId: $organizationId, title: $title, personId: $personId) {
      roles {
        title
        person {
          id
          firstName
          lastName
        }
      }
    }
  }
`

export default compose(
  graphql(addRole, {name: 'addRole'}),
  graphql(deleteRole, {name: 'deleteRole'}))(OrganizationPeople);

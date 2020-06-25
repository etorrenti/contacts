import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Link} from 'react-router';

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

  renderPerson(x) {
    return <div className="col s12 m4" key={x.id}>
    </div>
  }

  handleAddRole(x) {
    console.log("Add role", x)
    this.closeAddRoleDialog()
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
        />
      </div>
    );
  }

  render() {
    console.log("XXX", this)
    let children = [];
    const {roles} = (this.props.data.roles) || [];
    if (roles) {
      children = <div className="people row">
        {this.props.data.roles.map(x => this.renderPerson(x))}
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

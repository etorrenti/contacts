import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Link} from 'react-router';

import OrganizationList from './OrganizationsList'
import ListList from './ListsList'
import PeopleList from './PeopleList'

class Home extends Component {

  render() {
    return (
      <div className="row">
        <div className="col s4">
          <OrganizationList />
        </div>
        <div className="col s4">
          <PeopleList />
        </div>
        <div className="col s4">
          <ListList />
        </div>
      </div>
    );
  }
}

export default Home;

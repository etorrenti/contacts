import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Link} from 'react-router';

import OrganizationList from './OrganizationsList'
import ListList from './ListsList'

class Home extends Component {

  render() {
    return (
      <div className="row">
        <div className="col s6">
          <OrganizationList />
        </div>
        <div className="col s6">
          <ListList />
        </div>
      </div>
    );
  }
}

export default Home;

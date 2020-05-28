import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Link, hashHistory} from 'react-router';


class OrganizationFunctionDetail extends Component {

  render() {
    return (
      <div className="row">
        {this.props.data.name}
      </div>
    );
  }
}

export default OrganizationFunctionDetail;

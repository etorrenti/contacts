import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Link} from 'react-router';

import query from '../queries/fetchPeople';

class PeopleList extends Component {

  renderPerson(x) {
    return <li className="collection-item" key={x.id}>{x.firstName} {x.lastName}</li>
  }

  renderOuter(children){
    return (
      <div>
        <h2>Persone
        &nbsp;
        <Link className="btn-floating btn-medium waves-effect waves-light red" to="/people/new">
          <i className="material-icons">add</i>
        </Link>
        </h2>
        {children}
      </div>
    );
  }

  render() {
    let children = [];
    if (!this.props.data.loading) {
      children = <div>
        <ul className="collection">
          {this.props.data.people.map(x => this.renderPerson(x))}
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

export default graphql(query)(PeopleList);

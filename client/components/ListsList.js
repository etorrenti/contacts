import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Link} from 'react-router';

import query from '../queries/fetchLists';

class ListsList extends Component {

  renderList(x) {
    return <li className="collection-item" key={x.id}>{x.name}</li>
  }

  renderOuter(children){
    return (
      <div>
        <h1>Liste</h1>
        {children}
      </div>
    );
  }

  render() {
    let children = [];
    if (!this.props.data.loading) {
      children = <div>
        <ul className="collection">
          {this.props.data.lists.map(x => this.renderList(x))}
        </ul>
        <Link className="btn-floating btn-large waves-effect waves-light red" to="/lists/new">
          <i className="material-icons">add</i>
        </Link>
      </div>
    } else {
      children =  <div className="progress">
        <div className="indeterminate"></div>
      </div>
    }

    return this.renderOuter(children);
  }
}

export default graphql(query)(ListsList);

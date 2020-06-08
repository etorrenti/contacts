import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Link} from 'react-router';

import query from '../queries/fetchPeople';

class PeopleList extends Component {

  onDelete(x){
    this.props.mutate({
      variables: {
        id: x.id
      },
      refetchQueries: [{query: query}]
    })
    .catch((e) => console.log(e));
  }

  renderPerson(x) {
    return <li className="collection-item" key={x.id}>
      <Link to={`/person/${x.id}`}>{x.firstName} {x.lastName}</Link>
       <i className="material-icons" onClick={ () => this.onDelete(x) }>delete</i>
      </li>
  }

  renderOuter(children){
    return (
      <div>
        <h2>Persone
        &nbsp;
        <Link className="btn-floating btn-medium waves-effect waves-light red" to="/person/new">
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

const mutation = gql`
  mutation DeletePerson($id: ID!){
    deletePerson(id: $id){
      id
    }
  }
`;
export default graphql(mutation)(graphql(query)(PeopleList));

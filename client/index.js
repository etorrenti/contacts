import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-client';
import {ApolloProvider} from 'react-apollo';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';

import App from './components/App';
import Home from './components/Home'
import CreateOrganization from './components/CreateOrganization'
import CreateList from './components/CreateList'

import 'materialize-css/dist/css/materialize.css'
import 'material-design-icons/iconfont/material-icons.css'
import './style/style.css'

const client = new ApolloClient({});

const Root = () => {
  return (<ApolloProvider client={client}>
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home}/>
        <Route path="/organizations/new" component={CreateOrganization}/>
        <Route path="/lists/new" component={CreateList}/>
      </Route>
    </Router>
  </ApolloProvider>)
};

ReactDOM.render(<Root/>, document.querySelector('#root'));

import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-client';
import {ApolloProvider} from 'react-apollo';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';

import 'materialize-css/dist/css/materialize.css'
import 'material-design-icons/iconfont/material-icons.css'
import './style/style.css'

import App from './components/App';
import Home from './components/Home'
import CreateOrganization from './components/CreateOrganization'
import CreatePerson from './components/CreatePerson'
import CreateFunction from './components/CreateFunction'
import CreateFunctionContact from './components/CreateFunctionContact'
import CreateList from './components/CreateList'
import CreatePersonContact from './components/CreatePersonContact'
import OrganizationDetail from './components/OrganizationDetail'
import PersonDetail from './components/PersonDetail'

const client = new ApolloClient({
  dataIdFromObject: o => o.id
});

const Root = () => {
  return (<ApolloProvider client={client}>
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home}/>
        <Route path="/organization/new" component={CreateOrganization}/>
        <Route path="/person/new" component={CreatePerson}/>
        <Route path="/organization/:id" component={OrganizationDetail}/>
        <Route path="/person/:id" component={PersonDetail}/>
        <Route path="/person/:id/contacts/new" component={CreatePersonContact}/>
        <Route path="/organization/:id/functions/new" component={CreateFunction}/>
        <Route path="/organization/:id/functions/:fId/contacts/new" component={CreateFunctionContact}/>
        <Route path="/lists/new" component={CreateList}/>
      </Route>
    </Router>
  </ApolloProvider>)
};

ReactDOM.render(<Root/>, document.querySelector('#root'));

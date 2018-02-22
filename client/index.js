import ReactDOM from 'react-dom'
import React from 'react'
import  ApolloClient  from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { BatchHttpLink } from "apollo-link-batch-http";
import { InMemoryCache } from 'apollo-cache-inmemory'
import {ApolloProvider} from 'react-apollo';
import { withClientState } from 'apollo-link-state';
import { ApolloLink } from 'apollo-link'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

import App from './app'

const defaultState = {
  filters: {
    __typename: 'Filters',
    material: false,
    styles: []
  }
}


// let link = new HttpLink({ 
//   credentials: 'same-origin'
//  })
let link = new HttpLink({ 
  uri: "/graphql" ,
  credentials: 'same-origin'
 })

const batchlink = new BatchHttpLink({ 
  uri: "/graphql" ,
  credentials: 'same-origin'
});
const cache = new InMemoryCache();

const stateLink = withClientState({
  cache,
  defaults: defaultState
})


const client = new ApolloClient({
  cache,
  link:ApolloLink.from([stateLink,batchlink])
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App/>
  </ApolloProvider>,
  document.getElementById('root'),
);

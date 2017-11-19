import ReactDOM from 'react-dom'
import React from 'react'
import  ApolloClient  from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { BatchHttpLink } from "apollo-link-batch-http";



import { InMemoryCache } from 'apollo-cache-inmemory'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

import {ApolloProvider} from 'react-apollo';
import App from './app'

// let link = new HttpLink({ 
//   credentials: 'same-origin'
//  })

const batchlink = new BatchHttpLink({ 
  uri: "/graphql" ,
  credentials: 'same-origin'
});


const client = new ApolloClient({
  link:batchlink,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App/>
  </ApolloProvider>,
  document.getElementById('root'),
);

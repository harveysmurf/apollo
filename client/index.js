import ReactDOM from 'react-dom'
import React from 'react'
import  ApolloClient  from 'apollo-client';
import { BatchHttpLink } from "apollo-link-batch-http";
import { InMemoryCache } from 'apollo-cache-inmemory'
import {ApolloProvider} from 'react-apollo';
import { withClientState } from 'apollo-link-state';
import { ApolloLink } from 'apollo-link'
import mutationResolvers from './resolvers/mutations'
import typeDefs from './typeDefs'

import App from './app'

const defaultState = {
  filters: {
    material: '',
    styles: [],
    colors: ['cheren', 'byal'],
    price: {
      min: 16,
      max: 55
    },
    lastcolor: null
  },
  pdp: {
    mainImage: 0
  }
}

const batchlink = new BatchHttpLink({ 
  uri: "/graphql" ,
  credentials: 'same-origin'
});
const cache = new InMemoryCache({
  addTypename: false
});

const stateLink = withClientState({
  cache,
  defaults: defaultState,
  resolvers: {
    Mutation: mutationResolvers
  },
  typeDefs
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

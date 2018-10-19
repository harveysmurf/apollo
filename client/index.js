import ReactDOM from 'react-dom'
import React from 'react'
import _ from 'lodash'
import  ApolloClient  from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { BatchHttpLink } from "apollo-link-batch-http";
import { InMemoryCache } from 'apollo-cache-inmemory'
import {ApolloProvider} from 'react-apollo';
import { withClientState } from 'apollo-link-state';
import { ApolloLink } from 'apollo-link'
import { filtersQuery } from './queries/local'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

import App from './app'

const defaultState = {
  filters: {
    material: '',
    styles: [],
    colors: ['cheren', 'byal'],
    price: {
      min: 16,
      max: 55
    }
  }
}

function customizer(objValue, srcValue) {
  if (_.isArray(objValue)) {
    return srcValue
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
const cache = new InMemoryCache({
  addTypename: false
});

const stateLink = withClientState({
  cache,
  defaults: defaultState,
  resolvers: {
    Mutation: {
      updateColors: (obj, { colors }, { cache } ) => {
        cache.writeData({
          data: {
            filters: {
              colors
            }
          }
        })
        return null
      },
      updateFilters: (obj, args, { cache } ) => {
        console.log('not here')
        const currentFilters = cache.readQuery({query: filtersQuery}).filters
        const filters = _.mergeWith(currentFilters,args.filters, customizer)
        const data = {
          data: {
            filters: {
              ...filters
            }
          }
        }
        console.log(data)
        console.log('hello')
        cache.writeData(data)
        return null
      }
    }
  }
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

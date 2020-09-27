import ReactDOM from 'react-dom'
import React from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import ApolloClient from 'apollo-client'
import { BatchHttpLink } from 'apollo-link-batch-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks'
import { withClientState } from 'apollo-link-state'
import { ApolloLink } from 'apollo-link'

import { BrowserRouter as Router } from 'react-router-dom'
import mutationResolvers from './resolvers/mutations'
import { subscribeClientToScreenSizeChange, getScreenSize } from './screen'

import App from './app'
library.add(far, fas, fab)

export const defaultState = {
  features: {
    PDP_SIMILAR_PRODUCTS: false,
    PDP_RECOMMENDED_PRODUCTS: false,
    PDP_LAST_VIEWED: false,
    PDP_VIEW_COUNT: false,
    NEWSLETTER_SUBSCRIBE: false,
    PDP_NOTIFY_AVAILABLE: false,
    LOGIN_ENABLED: false,
    THUMB_CAROUSEL_ENABLED: false
  },
  filters: {
    search: '',
    materials: [],
    styles: [],
    colors: [],
    price: {
      min: 10,
      max: 140
    },
    lastcolor: null
  },
  pdp: {
    mainImage: 0
  },
  screenSize: getScreenSize()
}

const batchlink = new BatchHttpLink({
  uri: '/graphql',
  credentials: 'same-origin'
})
const cache = new InMemoryCache({
  addTypename: false
})

const stateLink = withClientState({
  cache,
  defaults: defaultState
})

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([stateLink, batchlink]),
  resolvers: {
    Mutation: mutationResolvers
  }
})
subscribeClientToScreenSizeChange(client)

ReactDOM.render(
  <ApolloHooksProvider client={client}>
    <ApolloProvider client={client}>
      <Router>
        <App />
      </Router>
    </ApolloProvider>
  </ApolloHooksProvider>,
  document.getElementById('root')
)

import ReactDOM from 'react-dom'
import React from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  ApolloLink
} from '@apollo/client'
import { BatchHttpLink } from '@apollo/client/link/batch-http'

import { BrowserRouter as Router } from 'react-router-dom'
import mutationResolvers from './resolvers/mutations'
import { subscribeClientToScreenSizeChange, getScreenSize } from './screen'

import App from './app'
import {
  featuresQuery,
  filtersQuery,
  mainImageQuery,
  screenSizeQuery
} from './queries/local'
import { typePolicies } from './typePolicies'
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
  typePolicies
})
cache.writeQuery({
  query: filtersQuery,
  data: {
    filters: defaultState.filters
  }
})
cache.writeQuery({
  query: featuresQuery,
  data: { features: defaultState.features }
})
cache.writeQuery({ query: mainImageQuery, data: { pdp: defaultState.pdp } })
cache.writeQuery({
  query: screenSizeQuery,
  data: { screenSize: defaultState.screenSize }
})

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([batchlink]),
  resolvers: {
    Mutation: mutationResolvers
  }
})
subscribeClientToScreenSizeChange(client)

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <App />
    </Router>
  </ApolloProvider>,
  document.getElementById('root')
)

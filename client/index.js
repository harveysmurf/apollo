import ReactDOM from 'react-dom'
import React from 'react'
import { library, config } from '@fortawesome/fontawesome-svg-core'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'

import { BrowserRouter as Router } from 'react-router-dom'
import mutationResolvers from './resolvers/mutations'
import { subscribeClientToScreenSizeChange, getScreenSize } from './screen'

import App from './app'
import { screenSizeQuery } from './queries/local'
library.add(far, fas, fab)
config.autoAddCss = false

const cache = new InMemoryCache({}).restore(window.__APOLLO_STATE__)

cache.writeQuery({
  query: screenSizeQuery,
  data: { screenSize: getScreenSize() }
})
const client = new ApolloClient({
  cache,
  uri: '/graphql',
  credentials: 'same-origin',
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

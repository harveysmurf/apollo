import React from 'react'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import { dom, library } from '@fortawesome/fontawesome-svg-core'

import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { SchemaLink } from '@apollo/client/link/schema'
import { StaticRouter } from 'react-router-dom'

import App from '../client/app'
import {
  featuresQuery,
  filtersQuery,
  mainImageQuery,
  screenSizeQuery
} from '../client/queries/local'
import { defaultState } from '../shared/defaultState'
import { screens } from '../client/screen'

const Html = ({ content, state, helmet }) => {
  const htmlAttrs = helmet.htmlAttributes.toComponent()
  const bodyAttrs = helmet.bodyAttributes.toComponent()

  return (
    <html {...htmlAttrs}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="utf-8" />
        {helmet.title.toComponent()}
        {helmet.meta.toComponent()}
        {helmet.link.toComponent()}
        <link rel="stylesheet" type="text/css" href="/styles.css" />
        <style type="text/css">{dom.css()}</style>
      </head>
      <body {...bodyAttrs}>
        <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
        <div id="modal-root" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__APOLLO_STATE__=${JSON.stringify(state).replace(
              /</g,
              '\\u003c'
            )};`
          }}
        />
        <script src="/index_bundle.js" />
      </body>
    </html>
  )
}

const context = {}
const renderApplication = (url, schema, serverContext, isPhone ) => {
  library.add(far, fas, fab)
  const cache = new InMemoryCache()
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
    data: { screenSize: isPhone ? screens.phone : screens.desktop }
  })
  const client = new ApolloClient({
    ssrMode: true,
    // resolvers,
    // Remember that this is the interface the SSR server will use to connect to the
    // API server, so we need to ensure it isn't firewalled, etc
    link: new SchemaLink({ schema, context: serverContext }),
    cache
  })
  const Application = (
    <ApolloProvider client={client}>
      <StaticRouter location={url} context={context}>
        <App />
      </StaticRouter>
    </ApolloProvider>
  )
  return {
    client,
    Application
  }
}
export { renderApplication, Html }

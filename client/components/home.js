import React from 'react'
import Latest from './home/latest'
import { Helmet } from 'react-helmet'

export default () => (
  <div className="confined-container">
    <Helmet>
      <title>My custom home page title</title>
      <meta name="description" content="some descriptin" />
    </Helmet>
    {/* <Presentation /> */}
    <Latest />
  </div>
)

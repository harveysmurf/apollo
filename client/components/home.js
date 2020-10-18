import React from 'react'
import Latest from './home/latest'
import Presentation from './home/presentation'
import { Helmet } from 'react-helmet'

export default () => (
  <div className="confined-container">
    <Helmet>
      <title>My custom home page title</title>
    </Helmet>
    <Presentation />
    <Latest />
  </div>
)

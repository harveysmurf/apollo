import React from 'react'
import qs from 'query-string'
export default props => {
    const searchQuery = qs.parse(props.location.search)
  console.log(searchQuery)
  return <h1>mihes</h1>
}

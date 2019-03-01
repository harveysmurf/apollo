import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import qs from 'query-string'
import CategoryContainer from './category/category_container'
import ProductContainer from './product/product_container'

const query = gql`
  query getRouteType($slug: String!) {
    getRouteType(slug: $slug)
  }
`

const RouteResolver = props => {
  let type = false

  if (props.data.loading) return <div>Loading</div>
  else type = props.data.getRouteType
  if (!type) return <div>Page not found</div>
  else if (type == 'category')
    return (
      <CategoryContainer
        slug={props.data.variables.slug}
        url={props.match.url}
      />
    )
  else return <ProductContainer slug={props.data.variables.slug} />
}

export default graphql(query, {
  options: ({
    match: {
      params: { param: path }
    }
  }) => ({
    variables: {
      slug: path.split('/').pop()
    }
  })
})(RouteResolver)

import React from 'react'
import qs from 'query-string'
import * as R from 'ramda'
import Sidebar from '../category/sidebar'
import ProductThumb from '../product/product_thumb'
import { Query } from '@apollo/client/react/components'
import { filtersQuery } from '../../queries/local'
import { getProductsFeedQuery } from '../../queries/remote'
import { useQuery } from '@apollo/client'

export default ({ location: { search } }) => {
  const query = qs.parse(search).q
  const { loading: filtersLoading, data: getFilters } = useQuery(filtersQuery)
  if (filtersLoading || !getFilters) {
    return null
  }
  const filters = getFilters.filters
  return (
    <Query
      query={getProductsFeedQuery}
      variables={{ ...filters, ...(query && { search: query }) }}
    >
      {({ data: { getProducts } = {}, loading, fetchMore }) => {
        if (loading) {
          return <div>Loading</div>
        }

        return (
          <div className="category row">
            <div className="col-sm-12 bottom-spacing-xl">
              <h1>Търсене: {query} </h1>
            </div>
            <Sidebar url="damski-chanti" filters={filters} />
            <div className="col-sm-12 col-md-9 no-gutters-xs">
              <div className="row">
                {getProducts.products.map((p, index) => (
                  <div key={index} className="col-sm-3">
                    <ProductThumb product={p} />
                  </div>
                ))}
              </div>
              <div className="row">
                {getProducts.hasMore ? (
                  <button
                    onClick={() =>
                      fetchMoreProducts(filters, getProducts.cursor, fetchMore)
                    }
                  >
                    Load more
                  </button>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
        )
      }}
    </Query>
  )
}

const fetchMoreProducts = (filters, cursor, fetchMore) => {
  return fetchMore({
    variables: {
      cursor,
      colors: filters.colors
    },
    updateQuery(previousResult, { fetchMoreResult }) {
      const previousProductFeed = previousResult.getProducts
      const newProductFeed = fetchMoreResult.getProducts

      const newData = {
        cursor: newProductFeed.cursor,
        hasMore: newProductFeed.hasMore,
        products: R.unionWith(
          (a, b) => {
            return a.model === b.model
          },
          previousProductFeed.products,
          newProductFeed.products
        )
      }

      return {
        getProducts: newData
      }
    }
  })
}

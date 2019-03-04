import React from 'react'
import qs from 'query-string'
import * as R from 'ramda'
import Sidebar from '../category/sidebar'
import ProductThumb from '../product/product_thumb'
import { Query } from 'react-apollo'
import { filtersQuery } from '../../queries/local'
import { getProductsFeedQuery } from '../../queries/remote'
// export default props => {
//   const searchQuery = qs.parse(props.location.search)
//   console.log(searchQuery)
//   return <h1>mihes</h1>
// }

export default ({ location: { search } }) => {
  const query = qs.parse(search).q
  console.log(query)
  return (
    <Query query={filtersQuery}>
      {({ data: { filters } }) => (
        <Query
          query={getProductsFeedQuery}
          variables={{ ...filters, ...(query && { search: query }) }}
        >
          {({ data: { getProducts }, loading, fetchMore }) => {
            if (loading) {
              return <div>Loading</div>
            }

            return (
              <div className="category row">
                <Sidebar
                  className="col-sm-12 col-lg-4"
                  url="damski-chanti"
                  filters={filters}
                />
                <div className="col-sm-12 col-lg-8">
                  <h3>Търсене: {query} </h3>
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
                          fetchMoreProducts(
                            filters,
                            getProducts.cursor,
                            fetchMore
                          )
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
      )}
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
      console.log(newData.products)

      return {
        getProducts: newData
      }
    }
  })
}

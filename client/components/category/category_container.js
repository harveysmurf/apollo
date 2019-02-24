import PropTypes from 'prop-types'
import React from 'react'
import Sidebar from './sidebar'
import _ from 'lodash'
import ProductThumb from '../product/product_thumb'
import { Query } from 'react-apollo'
import { filtersQuery } from '../../queries/local'
import { categoryQuery } from '../../queries/remote'

let CategoryContainer = ({ slug, url }) => (
  <Query query={filtersQuery}>
    {({ data: { filters } }) => (
      <Query query={categoryQuery} variables={{ slug, ...filters }}>
        {({ data: { getCategory }, loading, fetchMore }) => {
          if (loading) {
            return <div>Loading...</div>
          } else {
            return (
              <div className="category row">
                <Sidebar
                  className="col-sm-12 col-lg-4"
                  url={url}
                  category={getCategory}
                  filters={filters}
                />
                <div className="col-sm-12 col-lg-8">
                  <h3>{getCategory.name}</h3>
                  <div className="row">
                    {getCategory.productFeed.products.map((p, index) => (
                      <div key={index} className="col-sm-3">
                        <ProductThumb product={p} />
                      </div>
                    ))}
                  </div>
                  <div className="row">
                    {getCategory.productFeed.hasMore ? (
                      <button
                        onClick={() =>
                          fetchMoreProducts(
                            filters,
                            getCategory.productFeed.cursor,
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
          }
        }}
      </Query>
    )}
  </Query>
)

const fetchMoreProducts = (filters, cursor, fetchMore) => {
  return fetchMore({
    variables: {
      cursor,
      colors: filters.colors
    },
    updateQuery(previousResult, { fetchMoreResult }) {
      const previousProductFeed = previousResult.getCategory.productFeed
      const newProductFeed = fetchMoreResult.getCategory.productFeed

      const newGetCategoryData = Object.assign({}, previousResult.getCategory, {
        productFeed: Object.assign({}, previousResult.getCategory.productFeed, {
          products: _.unionWith(
            previousProductFeed.products,
            newProductFeed.products,
            _.isEqual
          ),
          cursor: newProductFeed.cursor,
          hasMore: newProductFeed.hasMore
        })
      })
      const newData = Object.assign({}, previousResult, {
        getCategory: newGetCategoryData
      })

      return newData
    }
  })
}
CategoryContainer.propTypes = {
  slug: PropTypes.string,
  url: PropTypes.string
}
export default CategoryContainer

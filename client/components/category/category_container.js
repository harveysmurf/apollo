import PropTypes from 'prop-types'
import React from 'react'
import * as R from 'ramda'
import Sidebar from './sidebar'
import _ from 'lodash'
import ProductThumb from '../product/product_thumb'
import { Query } from 'react-apollo'
import { filtersQuery } from '../../queries/local'
import { categoryQuery } from '../../queries/remote'
import { Breadcrumbs } from '../breadcrumbs/breadcrumbs-list.jsx'
import { useQuery } from '@apollo/react-hooks'

const CategoryContainer = ({ slug, url }) => {
  const {
    loading: filtersLoading,
    data: { filters }
  } = useQuery(filtersQuery)
  if (filtersLoading) {
    return null
  }
  const { loading, data, fetchMore } = useQuery(categoryQuery, {
    variables: {
      slug,
      ...R.omit(['search'], filters)
    }
  })
  if (loading) {
    return <div>Loading...</div>
  } else {
    const getCategory = data.getCategory
    return (
      <div className="category row">
        <div className="col-sm-12 bottom-spacing-m">
          <Breadcrumbs breadcrumbs={getCategory.breadcrumbs} />
        </div>
        <Sidebar
          className="col-sm-12 col-md-3"
          url={url}
          category={getCategory}
          filters={filters}
        />
        <div className="col-sm-12 col-md-9">
          <h3>{getCategory.name}</h3>
          <div className="row">
            {getCategory.productFeed.products.map((p, index) => (
              <div
                key={[index, p.model].join('|')}
                className="col-sm-6 col-md-4 col-lg-3"
              >
                <ProductThumb categoryId={getCategory.id} product={p} />
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
                Зареди още
              </button>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    )
  }
}

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

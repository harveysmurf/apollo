import PropTypes from 'prop-types'
import React, { useLayoutEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import * as R from 'ramda'
import Sidebar from './sidebar'
import ProductThumb from '../product/product_thumb'
import { filtersQuery } from '../../queries/local'
import { categoryQuery } from '../../queries/remote'
import { Breadcrumbs } from '../breadcrumbs/breadcrumbs-list.jsx'
import { useQuery } from '@apollo/client'

const CategoryContainer = ({
  match: {
    params: { categorySlug: slug }
  }
}) => {
  const [fetchMoreLoading, setFetchMoreLoading] = useState(false)
  const [scrollPositionBeforeFetch, setScrollPositionBeforeFetch] = useState()

  const { loading: filtersLoading, data: filtersData } = useQuery(filtersQuery)
  if (filtersLoading || !filtersData) {
    return null
  }
  const filters = (filtersData && filtersData.filters) || {}

  const { loading, data, fetchMore } = useQuery(categoryQuery, {
    variables: {
      slug,
      ...R.omit(['search'], filters)
    }
  })
  useLayoutEffect(
    () => {
      if (!fetchMoreLoading && scrollPositionBeforeFetch) {
        window.scrollTo(0, scrollPositionBeforeFetch)
        setScrollPositionBeforeFetch(undefined)
      }
    },
    [fetchMoreLoading, setScrollPositionBeforeFetch]
  )
  if (loading) {
    return <div>Зареждане...</div>
  } else if (!data) {
    return <h1>Page not found</h1>
  } else {
    const getCategory = data.getCategory
    const description = getCategory && getCategory.description
    return (
      <div className="category row">
        <Helmet>
          <title>{getCategory.meta_title}</title>
          <meta name="description" content={getCategory.meta_description} />
        </Helmet>
        <div className="col-sm-12 bottom-spacing-m">
          <Breadcrumbs breadcrumbs={getCategory.breadcrumbs} />
        </div>
        <Sidebar category={getCategory} filters={filters} />
        <div className="col-sm-12 col-md-9 no-gutters-xs">
          <div className="row">
            <div className="col-sm-12 bottom-spacing-m">
              <h3 className="bottom-spacing-m">{getCategory.title}</h3>
              {description && (
                <p
                  dangerouslySetInnerHTML={{ __html: getCategory.description }}
                />
              )}
            </div>
          </div>
          <div className="row">
            {getCategory.productFeed.products.map((p, index) => (
              <div
                key={[index, p.model].join('|')}
                className="col-sm-12 col-md-4 col-lg-3 no-gutters-xs"
              >
                <ProductThumb categoryId={getCategory.id} product={p} />
              </div>
            ))}
          </div>
          {getCategory.productFeed.hasMore ? (
            <button
              className="full-width-xs"
              onClick={() => {
                setFetchMoreLoading(true)
                setScrollPositionBeforeFetch(window.pageYOffset)
                fetchMoreProducts(
                  filters,
                  R.omit(['__typename'], getCategory.productFeed.cursor),
                  fetchMore
                ).finally(() => {
                  setFetchMoreLoading(false)
                })
              }}
            >
              {fetchMoreLoading ? '...' : 'Зареди още'}
            </button>
          ) : (
            ''
          )}
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
        productFeed: Object.assign({}, previousProductFeed, {
          products: R.unionWith(
            R.equals,
            previousProductFeed.products,
            newProductFeed.products
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

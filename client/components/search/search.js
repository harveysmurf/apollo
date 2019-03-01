import React from 'react'
import qs from 'query-string'
import Sidebar from './sidebar'
import ProductThumb from '../product/product_thumb'
import { Query } from 'react-apollo'
export default props => {
  const searchQuery = qs.parse(props.location.search)
  console.log(searchQuery)
  return <h1>mihes</h1>
}


const CategoryContainerComponent = () => (
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
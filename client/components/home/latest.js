import React from 'react'
import { useQuery } from '@apollo/client'
import { getProductsFeedQuery } from '../../queries/remote'
import ProductThumb from '../product/product_thumb'
export default () => {
  const { loading, data } = useQuery(getProductsFeedQuery, {
    variables: {
      limit: 4,
      colors: []
    }
  })
  if (loading || !(data && data.getProducts && data.getProducts.products)) {
    return null
  }
  return (
    <div className="row">
      <div className="col-sm-12 bottom-spacing-m">
        <h3>Нови Модели</h3>
      </div>
      {data.getProducts.products.map((product, key) => (
        <div key={key} className="col-sm-12 col-md-3">
          <ProductThumb product={product} />
        </div>
      ))}
    </div>
  )
}

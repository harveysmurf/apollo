import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { getProductsFeedQuery } from '../../queries/remote'
import ProductThumb from '../product/product_thumb'
export default () => {
  const { loading, data } = useQuery(getProductsFeedQuery, {
    variables: {
      limit: 4
    }
  })
  if (loading) {
    return null
  }
  return (
    <div className="row">
      <div className="col-sm-12">Нови</div>
      {data.getProducts.products.map((product, key) => (
        <div key={key} className="col-sm-3">
          <ProductThumb product={product} />
        </div>
      ))}
    </div>
  )
}

import React from 'react'
import { useQuery } from '@apollo/client'
import { getProductsFeedQuery } from '../../queries/remote'
import ProductRow from './product_row.jsx'
export default () => {
  const { loading, data } = useQuery(getProductsFeedQuery, {
    variables: {
      limit: 4
    }
  })
  if (loading || !(data && data.getProducts && data.getProducts.products)) {
    return null
  }
  return (
    <ProductRow header="Нови Модели" products={data.getProducts.products} />
  )
}

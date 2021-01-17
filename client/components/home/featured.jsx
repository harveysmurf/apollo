import React from 'react'
import { useQuery } from '@apollo/client'
import { getFeaturedProductsQuery } from '../../queries/remote'
import ProductRow from './product_row.jsx'

const featured = ['2408AA', '2346AE', '0655AD', '0306AA']

const Featured = () => {
  const { loading, data } = useQuery(getFeaturedProductsQuery, {
    variables: {
      limit: 4,
      models: featured
    }
  })
  if (loading || !(data && data.getProducts && data.getProducts.products)) {
    return null
  }
  return (
    <ProductRow products={data.getProducts.products} header="Препоръчани" />
  )
}
export default Featured

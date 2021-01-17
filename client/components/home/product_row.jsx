import React from 'react'
import ProductThumb from '../product/product_thumb'

const ProductRow = ({ header, products }) => {
  return (
    <div className="row">
      <div className="col-sm-12 bottom-spacing-m">
        <h3>{header}</h3>
      </div>
      {products.map((product, key) => (
        <div key={key} className="col-sm-12 col-md-3">
          <ProductThumb product={product} />
        </div>
      ))}
    </div>
  )
}

export default ProductRow

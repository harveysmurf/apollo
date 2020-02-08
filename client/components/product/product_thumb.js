import React, { Component, useState } from 'react'
import { Link } from 'react-router-dom'

const ProductThumb = ({ categoryId, product }) => {
  const referer = categoryId ? `?referer=${categoryId}` : ''
  const [mainImg, setMainImg] = useState(product.images[0])
  return (
    <div className="text-center product-thumb">
      <div>
        <Link to={`/${product.slug}/${product.model}${referer}`}>
          <img width={150} height={150} src={product.images[0]} />
        </Link>
      </div>
      <div className="product-details">
        <div>
          <a href="#">{`${product.name} | ${product.model}`}</a>
        </div>
        <div className="text-left">{product.description}</div>
        <div className="text-left">
          <b>{product.price.toFixed(2)} лв.</b>
        </div>
      </div>
    </div>
  )
}

export default ProductThumb

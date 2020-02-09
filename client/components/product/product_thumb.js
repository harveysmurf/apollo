import React, { Component, useState } from 'react'
import { Link } from 'react-router-dom'
import { getImageCachedSizePath } from '../../../utils/image_utils'

const getSelectedVariation = (variations = [], selectedModel) => {
  return variations.find(({ model }) => model === selectedModel)
}

const ProductVariation = ({ variation, isSelected, selectVariation }) => {
  return (
    <img
      className={`color-image ${isSelected ? 'selected' : ''}`}
      onClick={selectVariation}
      src={getImageCachedSizePath(variation.images[0], 'xs')}
    />
  )
}

const ProductThumb = ({ categoryId, product }) => {
  const { variations, model } = product
  const referer = categoryId ? `?referer=${categoryId}` : ''
  const [selected, setSelected] = useState(
    getSelectedVariation(variations, model)
  )
  return (
    <div className="product-thumb">
      <div className="text-center">
        <Link to={`/${selected.slug}/${selected.model}${referer}`}>
          <img width={150} height={150} src={selected.images[0]} />
        </Link>
      </div>
      <div className="product-details">
        <div className="text-center">
          <a href="#">{`${selected.name} | ${selected.model}`}</a>
        </div>
        <div className="text-left">{selected.description_short}</div>
        <div className="text-left">
          <b>{product.price.toFixed(2)} лв.</b>
        </div>
      </div>
      <div>
        {variations.map(variation => (
          <ProductVariation
            key={variation.model}
            variation={variation}
            isSelected={variation.model === selected.model}
            selectVariation={() => setSelected(variation)}
          />
        ))}
      </div>
    </div>
  )
}

export default ProductThumb

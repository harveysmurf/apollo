import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { getImageCachedSizePath } from '../../../utils/image_utils'
import { featuresQuery } from '../../queries/local'
import { useQuery } from '@apollo/react-hooks'
import { formatPrice } from '../../localization/price'

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
  const { THUMB_CAROUSEL_ENABLED } = useQuery(featuresQuery)
  return (
    <div className="product-thumb">
      <div className="text-center">
        <Link to={`/${selected.slug}/${selected.model}${referer}`}>
          <img width={150} height={150} src={selected.images[0]} />
        </Link>
      </div>
      <div className="product-details">
        <div>
          <a href="#">{`${selected.name} | ${selected.model}`}</a>
        </div>
        <div>
          <b>{formatPrice(product.price)}</b>
        </div>
      </div>
      {THUMB_CAROUSEL_ENABLED && (
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
      )}
    </div>
  )
}

export default ProductThumb

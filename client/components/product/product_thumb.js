import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { getImageCachedSizePath } from '../../../utils/image_utils'
import { featuresQuery } from '../../queries/local'
import { useQuery } from '@apollo/client'
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
      {selected.discount && (
        <div className="ribbon">
          <div className="ribbon-rectangle">{`${selected.discount}%`}</div>
        </div>
      )}
      {selected.quantity < 1 && <div className="out-of-stock">Изчерпана</div>}
      <div className="text-center">
        <Link to={`/${selected.slug}/${selected.model}${referer}`}>
          <img
            alt={`${selected.name}-m`}
            src={getImageCachedSizePath(selected.images[0], 'm')}
          />
        </Link>
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
      <div className="product-details">
        <div>
          <Link to={`/${selected.slug}/${selected.model}${referer}`}>
            {`${selected.name} | ${selected.model}`}
          </Link>
        </div>
        <div className="product-price">
          <b>{formatPrice(selected.sellPrice)}</b>
          {selected.discount && (
            <span className="original-price">
              {formatPrice(selected.price)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductThumb

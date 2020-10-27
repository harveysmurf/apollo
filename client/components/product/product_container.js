import React, { useEffect, useState } from 'react'
import qs from 'query-string'
import { compose } from 'recompose'
import { Link } from 'react-router-dom'
import { formatPrice } from '../../localization/price'
import ProductSlideshow from './products_slideshow'
import ProductGallery from './gallery/gallery'
import { AddToCart } from '../../mutations/remote'
import { getProductQuery, cartQuery } from '../../queries/remote'
import { featuresQuery } from '../../queries/local'
import { similarProducts, lastViewed } from '../../../data/fixtures'
import { getImageCachedSizePath } from '../../../utils/image_utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Breadcrumbs } from '../breadcrumbs/breadcrumbs-list.jsx'
import Characteristics from './characteristics'
import { materials } from '../category/material_filter'
import { Helmet } from 'react-helmet'
import { useMutation, useQuery } from '@apollo/client'

const ProductVariationThumb = ({
  name,
  selected,
  image,
  model,
  slug,
  referer
}) => (
  <Link
    to={`/${slug}/${model}${(referer && '?referer=' + referer) || ''}`}
    className="text-center"
  >
    <div className="color-thumbnail">
      <img
        className={`color-image ${selected ? 'selected' : ''}`}
        height="50"
        width="50"
        src={getImageCachedSizePath(image, 'xs')}
        alt={name}
      />
      {selected ? <FontAwesomeIcon icon="check-circle" /> : null}
    </div>
  </Link>
)

const FlashMessage = ({ open = null }) =>
  open && (
    <span className="toast" style={{ top: '50%' }}>
      Продуктът беше успешно добавен в кошницата
    </span>
  )

function NotifyMe(available) {
  if (!available)
    return (
      <div className="notify-me col-sm-6 col-md-7">
        <div>
          <FontAwesomeIcon icon="bell" />
          <span>
            <b>Информирай ме</b>
          </span>
        </div>
        <div>
          <p>
            Ако искате да получите имейл когато този продукт е наличен, моля
            въведете имейла си по-долу:
          </p>
        </div>
        <div>
          <input type="text" placeholder="имейл" />
          <button className="btn">Уведоми ме</button>
        </div>
      </div>
    )
}
const ProductContainer = props => {
  const [flashOpened, setFlashOpened] = useState(false)
  const [mainImage, setMainImage] = useState(0)
  const onProductAdded = () => {
    if (!flashOpened) {
      setFlashOpened(true)
      setTimeout(() => {
        setFlashOpened(false)
      }, 5000)
    }
  }
  const { data: getFeatures, loading: featuresLoading } = useQuery(
    featuresQuery
  )
  const [addToCart, { loading: addToCartLoading }] = useMutation(AddToCart, {
    onCompleted: onProductAdded,
    update: (cache, { data }) => {
      if (data && data.addToCart) {
        cache.writeQuery({
          query: cartQuery,
          data: {
            cart: data.addToCart
          }
        })
      }
    }
  })

  useEffect(() => {
    document.body.scrollTop = 0 // For Safari
    document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
  }, [])
  const {
    referer,
    match: {
      params: { model: urlModel }
    }
  } = props
  const { data, loading } = useQuery(getProductQuery, {
    variables: {
      model: urlModel,
      referer
    }
  })
  if (loading || featuresLoading) {
    return (
      <div className="fa-5x text-center">
        <FontAwesomeIcon icon="spinner" spin />
      </div>
    )
  }

  if (!data) {
    return null
  }
  const {
    quantity,
    breadcrumbs,
    dimensions,
    material,
    style,
    name,
    meta_title,
    meta_description,
    images,
    description_short,
    description,
    variations,
    model,
    price,
    sellPrice,
    discount
  } = data.getProduct
  const available = quantity > 0
  const features = getFeatures.features
  return (
    <div className="product row">
      <Helmet>
        <title>{meta_title}</title>
        <meta name="description" content={meta_description} />
      </Helmet>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="col-sm-12 bottom-spacing-m">
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </div>
      )}
      <div className="col-sm-12 col-lg-8">
        <div className="product-gallery">
          <ProductGallery
            images={images}
            selected={mainImage}
            setMainImage={setMainImage}
            model={model}
          />
        </div>
      </div>
      <div className="col-sm-12 col-lg-4">
        <div className="product-main">
          <div className="bottom-spacing-m">
            <h1>{`${name}`}</h1>
          </div>
          <div>
            {variations.map((c, idx) => {
              const selected = c.model === model
              return (
                <ProductVariationThumb
                  key={idx}
                  name={c.name}
                  selected={selected}
                  image={c.images.length && c.images[0]}
                  model={c.model}
                  slug={c.slug}
                  referer={referer}
                />
              )
            })}
          </div>
          <hr className="bottom-spacing-m" />
          <div className="row bottom-spacing-m">
            <div className="col-sm-6 text-left no-gutters">
              <div className="product-price">
                <b>{formatPrice(sellPrice)}</b>
                {discount && (
                  <span className="original-price">{formatPrice(price)}</span>
                )}
              </div>
            </div>
            <div className="col-sm-6 text-right no-gutters">
              {!available && (
                <span className="availability">Няма в наличност</span>
              )}
            </div>
          </div>
          <div className="row">
            <FlashMessage open={flashOpened} />
          </div>
          <div className="row product-buttons bottom-spacing-xl">
            {available && (
              <button
                disabled={addToCartLoading}
                onClick={() => {
                  addToCart({
                    variables: { model, quantity: 1 }
                  })
                }}
                className="tertiary add-to-cart"
              >
                {addToCartLoading ? (
                  <FontAwesomeIcon icon="spinner" spin />
                ) : (
                  <FontAwesomeIcon icon="cart-plus" />
                )}
                <span>Добави в количката</span>
              </button>
            )}
            {null && (
              <button className="">
                <FontAwesomeIcon icon="exchange-alt" />
              </button>
            )}
            {null && (
              <button>
                <FontAwesomeIcon icon="heart" />
              </button>
            )}
          </div>
          <div className="row delivery text-left">
            <FontAwesomeIcon icon="truck" />
            <span className="delivery">
              Безплатна доставка за поръчки над 90 лв
            </span>
          </div>
          {features.PDP_VIEW_COUNT && (
            <div className="row product-views row-center">
              700 човека разгледаха продукта
            </div>
          )}
          <br />
          <div className="bottom-spacing-m product-social">
            <a href="https://www.facebook.com/DamskiChantiCom">
              <FontAwesomeIcon size="lg" icon={['fab', 'facebook']} />
            </a>
            <a href="https://www.instagram.com/damskichanti_com/">
              <FontAwesomeIcon size="lg" icon={['fab', 'instagram']} />
            </a>
            <a href="https://www.youtube.com/channel/UCSR0CNfEt_LMwYSxv1Ecrxw">
              <FontAwesomeIcon size="lg" icon={['fab', 'youtube']} />
            </a>
            {features.PDP_NOTIFY_AVAILABLE && NotifyMe(available)}
          </div>
        </div>
        <div>
          <h4>Описание</h4>
          {description_short && (
            <div className="bottom-spacing-m">{description_short}</div>
          )}
        </div>
        <Characteristics
          material={materials[material]}
          style={style}
          dimensions={dimensions}
        />

        {/* <div className="information-tabs">
            <InformationTabs />
          </div> */}
      </div>
      <div>{description && <p1>{description}</p1>}</div>
      {features.PDP_SIMILAR_PRODUCTS && (
        <div className="col-sm-12 similar">
          <ProductSlideshow
            products={similarProducts}
            title="Подобни продукти"
          />
        </div>
      )}
      {features.PDP_LAST_VIEWED && (
        <div className="col-sm-12 last-viewed">
          <ProductSlideshow products={lastViewed} title="Последно разгледани" />
        </div>
      )}
    </div>
  )
}

const withQueryString = Component => props => {
  const queryParams = qs.parse(props.location.search)
  return <Component referer={queryParams.referer} {...props} />
}

export default compose(withQueryString)(ProductContainer)

import React, { Component } from 'react'
import qs from 'query-string'
import { compose } from 'recompose'
import { Mutation } from '@apollo/client/react/components'
import { Link } from 'react-router-dom'
import { formatPrice } from '../../localization/price'
import ProductSlideshow from './products_slideshow'
import ProductGallery from './gallery/gallery'
import { WithLoadingCheck } from '../shared/withQuery'
import { withMutation } from '../shared/withQuery'
import { resetState } from '../../mutations/local'
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

class ProductContainer extends Component {
  state = {
    flashOpened: null
  }
  constructor(props) {
    super(props)
    this.props.resetState()
  }

  componentDidMount() {
    document.body.scrollTop = 0 // For Safari
    document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
  }

  onProductAdded = () => {
    if (!this.state.flashOpened) {
      this.setState({
        flashOpened: true
      })
      setTimeout(() => {
        this.setState({
          flashOpened: null
        })
      }, 5000)
    }
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    const {
      data: {
        getProduct: { model }
      }
    } = this.props
    const {
      data: {
        getProduct: { model: prevModel }
      }
    } = prevProps
    if (prevModel && prevModel !== model) this.props.resetState()
  }
  notifyMe(available) {
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

  render() {
    const {
      referer,
      getFeatures: { features },
      data: {
        getProduct: {
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
        }
      }
    } = this.props
    const available = quantity > 0 
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
            <ProductGallery images={images} selected={0} model={model} />
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
              <FlashMessage open={this.state.flashOpened} />
            </div>
            <div className="row product-buttons bottom-spacing-xl">
              {available && (
                <Mutation
                  onCompleted={this.onProductAdded}
                  mutation={AddToCart}
                  update={(cache, { data }) => {
                    if (data && data.addToCart) {
                      cache.writeQuery({
                        query: cartQuery,
                        data: {
                          cart: data.addToCart
                        }
                      })
                    }
                  }}
                >
                  {addToCart => (
                    <button
                      onClick={() => {
                        addToCart({
                          variables: { model, quantity: 1 }
                        })
                      }}
                      className="tertiary add-to-cart"
                    >
                      <FontAwesomeIcon icon="cart-plus" />
                      Добави в количката
                    </button>
                  )}
                </Mutation>
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
              <a href="www.instagram.com">
                <FontAwesomeIcon size="lg" icon={['fab', 'instagram']} />
              </a>
              <a href="https://www.youtube.com/channel/UCSR0CNfEt_LMwYSxv1Ecrxw">
                <FontAwesomeIcon size="lg" icon={['fab', 'youtube']} />
              </a>
              {features.PDP_NOTIFY_AVAILABLE && this.notifyMe(available)}
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
            <ProductSlideshow
              products={lastViewed}
              title="Последно разгледани"
            />
          </div>
        )}
      </div>
    )
  }
}

const withProductQuery = WithLoadingCheck(getProductQuery, {
  options: props => ({
    variables: {
      model: props.match.params.model,
      referer: props.referer
    }
  })
})

const withFeaturesQuery = WithLoadingCheck(featuresQuery, {
  name: 'getFeatures'
})

const withQueryString = Component => props => {
  const queryParams = qs.parse(props.location.search)
  return <Component referer={queryParams.referer} {...props} />
}

export default compose(
  withQueryString,
  withFeaturesQuery,
  withProductQuery,
  withMutation(resetState, { name: 'resetState' })
)(ProductContainer)

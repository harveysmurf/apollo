import React, { Component } from 'react'
import qs from 'query-string'
import { compose } from 'recompose'
import { Mutation } from 'react-apollo'
import { Link } from 'react-router-dom'
import { formatPrice } from '../../localization/price'
import InformationTabs from './information_tabs'
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
          breadcrumbs,
          slug,
          name,
          images,
          colors,
          available,
          availableColors,
          main_image,
          description_short,
          description,
          variations,
          model,
          color,
          price
        }
      }
    } = this.props
    return (
      <div className="product row">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="col-sm-12 bottom-spacing-m">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
        )}
        <div className="col-sm-12 col-lg-7">
          <div className="product-gallery">
            <ProductGallery images={images} selected={0} model={model} />
          </div>
        </div>
        <div className="col-sm-12 col-lg-5">
          <div className="product-main">
            <div className="bottom-spacing-m">
              <h1>{`${color} ${name}`}</h1>
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
            <hr />
            <div className="row">
              <div className="col-sm-6 text-left">
                <span className="price">{formatPrice(price)}</span>
              </div>
              <div className="col-sm-6 text-right">
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
            <div className="row bottom-spacing-m">
              <div className="col-sm-6 col-md-5 product-social">
                <FontAwesomeIcon icon={['fab', 'facebook']} />
                <FontAwesomeIcon icon={['fab', 'instagram']} />
                <FontAwesomeIcon icon={['fab', 'twitter']} />
              </div>
              {features.PDP_NOTIFY_AVAILABLE && this.notifyMe(available)}
            </div>
          </div>
          <div>
            <h3>Описание</h3>
            {description_short && (
              <div className="bottom-spacing-s">{description_short}</div>
            )}
          </div>
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

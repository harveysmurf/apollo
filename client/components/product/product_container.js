import React, { Component } from 'react'
import { compose } from 'recompose'
import { Mutation } from 'react-apollo'
import { Link } from 'react-router-dom'
import InformationTabs from './information_tabs'
import ProductSlideshow from './products_slideshow'
import _ from 'lodash'
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

const ProductVariationThumb = ({ name, selected, image, model, slug }) => (
  <Link to={`/${slug}/${model}`} className="text-center">
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

class ProductContainer extends Component {
  constructor(props) {
    super(props)
    this.props.resetState()
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
      getFeatures: { features },
      data: {
        getProduct: {
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
        <div className="col-sm-12 col-lg-5">
          <div className="product-gallery">
            <ProductGallery images={images} selected={0} model={model} />
          </div>
        </div>
        <div className="col-sm-12 col-lg-7">
          <div className="product-main">
            <div>
              <h1>{name}</h1>
            </div>
            <div className="short-description">{description_short}</div>
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
                  />
                )
              })}
            </div>
            <hr />
            <div className="row">
              <div className="col-sm-6 text-left">
                <span className="price">
                  {price.toFixed(2).replace('.', ',')} лв
                </span>
              </div>
              <div className="col-sm-6 text-right">
                {!available && (
                  <span className="availability">Няма в наличност</span>
                )}
              </div>
            </div>
            <div className="row product-buttons">
              {available && (
                <Mutation
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
            <hr />
            <div className="row delivery text-left">
              <FontAwesomeIcon icon="truck" />
              <span className="delivery">
                Безплатна доставка за поръчки над 90 лв
              </span>
            </div>
            <hr />
            {features.PDP_VIEW_COUNT && (
              <div className="row product-views row-center">
                700 човека разгледаха продукта
              </div>
            )}
            <br />
            <div className="row">
              <div className="col-sm-6 col-md-5 product-social">
                <FontAwesomeIcon icon={['fab', 'facebook']} />
                <FontAwesomeIcon icon={['fab', 'instagram']} />
                <FontAwesomeIcon icon={['fab', 'twitter']} />
              </div>
              {features.PDP_NOTIFY_AVAILABLE && this.notifyMe(available)}
            </div>
          </div>
        </div>
        <div className="col-sm-12 information-tabs">
          <InformationTabs />
        </div>
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
      model: props.match.params.model
    }
  })
})

const withFeaturesQuery = WithLoadingCheck(featuresQuery, {
  name: 'getFeatures'
})

export default compose(
  withFeaturesQuery,
  withProductQuery,
  withMutation(resetState, { name: 'resetState' })
)(ProductContainer)

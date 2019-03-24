import React, { Fragment } from 'react'
import * as R from 'ramda'
import { Link } from 'react-router-dom'
import { Query, Mutation } from 'react-apollo'
import classNames from 'classnames/bind'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { cartQuery } from '../../queries/remote'
import { ModifyCart, RemoveItemFromCart } from '../../mutations/remote'
import { getImageCachedSizePath } from '../../../utils/image_utils'
import styles from './cart.scss'
const css = classNames.bind(styles)
const quantityDropdowns = available => {
  const itemsToRender = []
  for (var i = 1; i <= Math.min(available, 5); i++) {
    itemsToRender.push(<option value={i}>{i}</option>)
  }
  return itemsToRender
}

const EmptyBasket = () => <p>Вашата кошница е празна</p>
const CartRow = ({
  product: {
    available,
    model,
    images,
    name,
    quantity: productQuantity,
    color,
    price: productPrice
  },
  quantity,
  price
}) => (
  <Mutation
    mutation={ModifyCart}
    update={(cache, { data }) => {
      if (data && data.modifyCart) {
        cache.writeQuery({
          query: cartQuery,
          data: {
            cart: data.modifyCart
          }
        })
      }
    }}
  >
    {modifyCart => (
      <Mutation
        mutation={RemoveItemFromCart}
        update={(cache, { data }) => {
          if (data && data.removeItemFromCart) {
            cache.writeQuery({
              query: cartQuery,
              data: {
                cart: data.removeItemFromCart
              }
            })
          }
        }}
      >
        {removeItemFromCart => (
          <div className={css(['row', 'cart-row'])}>
            <div
              className={css(['col-sm-10 no-gutters', 'cart-row__cart-item'])}
            >
              <img src={getImageCachedSizePath(images[0], 's')} />
              <div className={css(['cart-row__cart-item-description'])}>
                <div className={css('cart-row__cart-line-item')}>
                  <a href="#">{name}</a>
                  <div className="hidden-sm">{productPrice} лв.</div>
                </div>
                <div>
                  <b>{color}</b>
                </div>
                <div>
                  <select
                    disabled={!available}
                    onChange={({ target: { value } }) =>
                      modifyCart({
                        variables: { model, quantity: parseInt(value) }
                      })
                    }
                    defaultValue={quantity}
                  >
                    {quantityDropdowns(productQuantity, quantity)}
                  </select>
                  БР.
                </div>
                <div>
                  <b>{price}лв.</b>
                </div>
              </div>
            </div>
            <div className="col-sm-2">
              <div className={css(['cart-row__item-actions'])}>
                <div
                  onClick={() => removeItemFromCart({ variables: { model } })}
                  className={css(['cart-row__cart-icon'])}
                >
                  <FontAwesomeIcon icon="times" />
                </div>
              </div>
            </div>
          </div>
        )}
      </Mutation>
    )}
  </Mutation>
)

export const CartSummary = ({ cart: { quantity, price }, hideSubmit }) => (
  <Fragment>
    <div className="row">
      <div className="col-sm-12">
        <h3>Общо кошница</h3>
        <br />
        {quantity} ПРОДУКТА
      </div>
    </div>
    <div className="row">
      <div className="col-sm-12 ">
        <div className="devider" />
      </div>
    </div>
    <div className="row bottom-spacing-xl">
      <div className={css(['col-sm-12', 'cart-summary-price'])}>
        <div>Общо цена</div>
        <div>{price} лв</div>
      </div>
    </div>
    {!hideSubmit && (
      <div className="row hidden-sm">
        <Link
          to="/checkout"
          className={css([
            'cart-button',
            'submit-button',
            'button',
            'text-center'
          ])}
        >
          Поръчка
        </Link>
      </div>
    )}
  </Fragment>
)

export const CartProductsList = ({ products: cartProducts }) => {
  return <div>{cartProducts.map(CartRow)}</div>
}

export const CartMiniSummary = ({ cart: { price, quantity } }) => (
  <div className="hidden-lg hidden-md row bottom-spacing-xl row-center">
    <div className="col-sm-6">
      <div>ОБЩО ({quantity} продукта)</div>
      <div>
        <b>{price}лв.</b>
      </div>
    </div>
    <div className="col-sm-6">
      <Link
        to="/checkout"
        className={css(['cart-button', 'submit-button button text-center'])}
      >
        Поръчка
      </Link>
    </div>
  </div>
)

export default props => (
  <Query query={cartQuery}>
    {({ data: { cart, loading } }) => (
      <Fragment>
        {[!cart, loading, cart && cart.products.length === 0].some(Boolean) ? (
          <EmptyBasket />
        ) : (
          <div className={css(['cart', 'row'])}>
            <div className="col-sm-12 col-md-8">
              <h3 className={css(['basket-header', 'col-sm-12'])}>Кошница</h3>
              <CartMiniSummary cart={cart} />
              <CartProductsList products={cart.products} />
              <div className="col-sm-offset-6 col-sm-6 hidden-sm no-gutters">
                <Link
                  to="/checkout"
                  className={css([
                    'cart-button',
                    'submit-button',
                    'button',
                    'text-center'
                  ])}
                >
                  Поръчка
                </Link>
              </div>
            </div>
            <div className="col-sm-12 col-md-4">
              <CartSummary cart={cart} />
            </div>
            <div className="col-sm-12 hidden-lg hidden-md">
              <div className="devider" />
            </div>
            <div className="col-sm-12 hidden-lg hidden-md no-gutters">
              <Link
                to="/checkout"
                className={css([
                  'cart-button',
                  'submit-button',
                  'button',
                  'text-center'
                ])}
              >
                Поръчка
              </Link>
            </div>
          </div>
        )}
      </Fragment>
    )}
  </Query>
)

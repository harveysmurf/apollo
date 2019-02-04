import React, {Fragment} from 'react'
import { Link} from 'react-router-dom'
import { Query } from 'react-apollo';
import classNames from 'classnames/bind'
import { cartQuery } from '../../queries/remote'
import { getImageCachedSizePath } from '../../../utils/image_utils'
import styles from './cart.scss'
const css = classNames.bind(styles)

const EmptyBasket = () => (<p>Вашата кошница е празна</p>)

const CartRow = ({product: {available, images, name, quantity:productQuantity, color}, quantity, price}) => (
    <Fragment>
    <div className={css(['row','cart-row'])}>
        <div className={css(['col-sm-10 no-gutters','cart-row__cart-item'])}>
            <img src={getImageCachedSizePath(images[0],'s')}/>
            <div className={css(['cart-row__cart-item-description'])}>
                    <div>{name}</div>
                    <div><b>{color}</b></div>
                    <div>
                        {quantity} БР.
                    </div>
                    <div><b>{price}лв.</b></div>
            </div>
        </div>
        <div className="col-sm-2">
            <div className={css(['cart-row__item-actions'])}>
                <div className={css(['cart-row__cart-icon'])}><i className="fa fa-close"></i></div>
                <div><i className="fa fa-heart"></i></div>
            </div>
        </div>
    </div>
    </Fragment>
)

export const CartSummary = ({cart: {quantity, price}}) => (
    <Fragment>    
        <div className="row">
            <div className="col-sm-12">
                <h3>Общо кошница</h3>
                <br/>
                {quantity} ПРОДУКТА
            </div>
        </div>
        <div className="row">
            <div className="col-sm-12 ">
                <div className="devider"></div>
            </div>
        </div>
        <div className="row bottom-spacing-xl">
            <div className="col-sm-12 text-right">Обща ЦЕНА {price} лв</div>
        </div>
    </Fragment>

)

export const CartProductsList = ({products: cartProducts}) => {
    return <div >{cartProducts.map(CartRow)}</div>
}

export const CartMiniSummary = ({cart: {price, quantity}}) => (
    <div className="row bottom-spacing-xl row-center">
        <div className="col-sm-6">
            <div>
                ОБЩО ({quantity} продукта)
            </div>
            <div>
                <b>{price}лв.</b>
            </div>
        </div>
        <div className="col-sm-6">
                <Link to="/checkout" className={css(["cart-button", "submit-button button text-center"])}>
                    Поръчка
                </Link>
        </div>
    </div>
)

export default  props => (
    <Query query={cartQuery}>
    {({ data: { cart, loading }}) => (
        <Fragment>
            {!cart && !loading ? <EmptyBasket/>: 
            (
                <Fragment>
                    <div className="col-sm-12">
                        <h3 className={css(['basket-header','col-sm-12'])}>Кошница</h3>
                    </div>
                    <CartMiniSummary cart={cart}/>
                    <div className='col-sm-12'>
                        <div className="devider"/>
                    </div>
                    <CartProductsList products={cart.products}/>
                    <CartSummary cart={cart}/>
                    <div className='col-sm-12'>
                        <div className="devider"/>
                    </div>
                    <div className="row">
                        <Link to="/checkout" className={css(["cart-button", "submit-button", "button", "text-center"])}>
                            Поръчка
                        </Link>
                    </div>
                </Fragment>
            )}
        </Fragment>
    )}
    </Query>
)
import React, {Fragment} from 'react'
import { Link} from 'react-router-dom'
import { Query } from 'react-apollo';
import { cartQuery } from '../../queries/remote'
import { getImageCachedSizePath } from '../../../utils/image_utils'

const EmptyBasket = () => (<p>Вашата кошница е празна</p>)

const CartRow = ({productColor, product, available, quantity}) => (
    <Fragment>
    <div className="row">
        <div className="col-sm-5">
            <img src={getImageCachedSizePath(productColor.images[0],'s')}/>
        </div>
        <div className="col-sm-7 row">
                <div className="col-sm-12">{product.name}</div>
                <div className="col-sm-12"><b>{productColor.name}</b></div>
                <div className="col-sm-12">
                    Количество: {quantity}
                </div>
                <div className="col-sm-12"><b>{product.price * quantity}лв.</b></div>
        </div>
    </div>
    </Fragment>
)

export const CartSummary = ({cart: {quantity, price}}) => (
    <Fragment>    
        <h3>Общо кошница</h3>
        <div className="row">
        {quantity} ПРОДУКТА
        </div>
        <hr/>
        <div className="row bottom-spacing-xl">
            <div className="col-sm-8">ЦЕНА</div>
            <div className="col-sm-4">{price}лв.</div>
        </div>
    </Fragment>

)

export const CartProductsList = ({products: cartProducts}) => {
    return <div className="row">{cartProducts.map(CartRow)}</div>
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
                <Link to="/checkout" className="submit-button button text-center">
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
                    <h3>Кошница</h3>
                    <CartMiniSummary cart={cart}/>
        <div className="col-sm-12 devider"/>
                    <CartProductsList products={cart.products}/>
                    <CartSummary cart={cart}/>
                    <div className="row">
                        <Link to="/checkout" className="submit-button button text-center">
                            Поръчка
                        </Link>
                    </div>
                </Fragment>
            )}
        </Fragment>
    )}
    </Query>
)
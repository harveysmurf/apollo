import React, {Fragment} from 'react'
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
    <hr/>
    </Fragment>
)

const CartSummary = ({cart: {quantity, price}}) => (
    <Fragment>    
        <h3>Общо кошница</h3>
        <div className="row">
        {quantity} ПРОДУКТА
        </div>
        <hr/>
        <div className="row">
            <div className="col-sm-8">ЦЕНА</div>
            <div className="col-sm-4">{price}лв.</div>
        </div>
        <div className="button submit-button">Поръчка</div>
    </Fragment>

)

const CartProductsList = ({products: cartProducts}) => {
    return <div className="row">{cartProducts.map(CartRow)}</div>
}

const CartMiniSummary = ({cart: {price, quantity}}) => (
    <div className="row bottom-spacing-xl">
        <div className="col-sm-6">
            <div>
                ОБЩО ({quantity} продукта)
            </div>
            <div>
                <b>{price}лв.</b>
            </div>
        </div>
        <div className="col-sm-6">
            <div className="button submit-button">Поръчка</div>
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
                </Fragment>
            )}
        </Fragment>
    )}
    </Query>
)
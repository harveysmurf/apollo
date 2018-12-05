import React, {Fragment} from 'react'
import { Link} from 'react-router-dom'
import { Query } from 'react-apollo';
import { cartQuery } from '../../queries/remote'
import { getImageCachedSizePath } from '../../../utils/image_utils'
import { Form, Field } from 'react-final-form'
import { CartProductsList, CartSummary} from '../cart/cart'


const EmptyBasket = () => (<p>Вашата кошница е празна</p>)

const TextInput = ({input, type}) => {
    return <input {...input} className="input" type={type ? type : 'text'}/>
}

const TextArea = ({input}) => (
    <textarea {...input} className="input"/>
)

const CheckoutForm = ({cart}) => (
    <Form
        onSubmit={values => {console.log(values)}}
        render={({handleSubmit, pristine, invalid}) => (
            <Fragment>
            <form onSubmit={handleSubmit}>
                <div className="row horizontal-align-center">
                    <div className="col-sm-3 col-md-3 text-right">
                        <label>Име</label>
                    </div>
                    <div className="col-sm col-md">
                        <Field name="name" type="text" component={TextInput} />
                    </div>
                </div>
                <div className="row horizontal-align-center">
                    <div className="col-sm-3 col-md-3 text-right">
                        <label>Фамилия</label>
                    </div>
                    <div className="col-sm col-md">
                        <Field name="last_name" component={TextInput} />
                    </div>
                </div>
                <div className="row horizontal-align-center">
                    <div className="col-sm-3 col-md-3 text-right">
                        <label>Имейл</label>
                    </div>
                    <div className="col-sm col-md">
                        <Field name="email" type="email" component={TextInput} />
                    </div>
                </div>
                <div className="row horizontal-align-center">
                    <div className="col-sm-3 col-md-3 text-right">
                        <label>Град</label>
                    </div>
                    <div className="col-sm col-md">
                        <Field name="city" component={TextInput} />
                    </div>
                </div>
                <div className="row horizontal-align-center">
                    <div className="col-sm-3 col-md-3 text-right">
                        <label>Адрес</label>
                    </div>
                    <div className="col-sm col-md">
                        <Field name="address" component={TextArea} />
                    </div>
                </div>
                <div className="row horizontal-align-center">
                    <div className="col-sm-3 col-md-3 text-right">
                        <label>Доставка</label>
                    </div>
                    <div className="col-sm col-md">
                        <div>
                            <label>
                                <Field
                                name="stooge"
                                component="input"
                                type="radio"
                                value="larry"
                                />{' '}
                                До Офис
                            </label>
                        </div>
                        <div>
                            <label>
                                <Field
                                name="stooge"
                                component="input"
                                type="radio"
                                value="moe"
                                />{' '}
                                До Адрес
                            </label>
                        </div>
                    </div>
                </div>
            </form>
            <div className="row devider"/>
                <CartProductsList products={cart.products}/>
                <div className="col-sm-12 devider"/>
                <CartSummary cart={cart}/>
            <div className="row">
                <button onClick={handleSubmit} className="submit-button button text-center">
                    Поръчка
                </button>
            </div>
            </Fragment>
        )}
    />
)

export default props => (
    <Query query={cartQuery}>
    {({ data: { cart, loading }}) => (
        <Fragment>
            {!cart && !loading ? <EmptyBasket/>: 
            (
                <Fragment>
                    <h3>Доставка</h3>
                    <CheckoutForm cart={cart}/>
                </Fragment>
            )}
        </Fragment>
    )}
    </Query>
)
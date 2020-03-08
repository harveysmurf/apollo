import React, { Fragment } from 'react'
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import { Query, Mutation } from 'react-apollo'
import { cartQuery } from '../../queries/remote'
import { getImageCachedSizePath } from '../../../utils/image_utils'
import { Form, Field } from 'react-final-form'
import { CartProductsList, CartSummary } from '../cart/cart'
import * as R from 'ramda'
import { Checkout } from '../../mutations/remote'
import { pluralize } from '../cart/cart'
import { formatPrice } from '../../localization/price'

const requiredFieldError = 'Задължително поле'
const REGEX_EMAIL = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
export const deliveryMethods = {
  toAddress: 'toAddress',
  toOffice: 'toOffice'
}
export const deliveryPrices = {
  [deliveryMethods.toAddress]: 6.5,
  [deliveryMethods.toOffice]: 5.5
}

const validationRules = {
  name: [
    {
      test: x => !!x,
      error: requiredFieldError
    }
  ],
  lastname: [
    {
      test: x => !!x,
      error: requiredFieldError
    }
  ],
  terms: [
    {
      test: x => !!x,
      error: requiredFieldError
    }
  ],
  ageConfirmation: [
    {
      test: x => !!x,
      error: requiredFieldError
    }
  ],
  city: [
    {
      test: x => !!x,
      error: 'Моля въведете населено място'
    }
  ],
  address: [
    {
      test: x => !!x,
      error: 'Моля въведете адрес за доставка'
    }
  ],
  telephone: [
    {
      test: x => !!x,
      error: 'Моля въведете телефонен номер'
    }
  ],
  email: [
    {
      test: x => !!x,
      error: requiredFieldError
    },
    {
      test: x => REGEX_EMAIL.test(x),
      error: 'Моля въведете валиден имейл'
    }
  ]
}

const TermsLabel = () => (
  <>
    Съгласен съм с <Link to="/terms">Условията за ползване на сайта</Link>
  </>
)

const validate = (data, rules) => {
  const getError = (fieldRules, field) => {
    const failedRule = fieldRules.find(
      rule => !rule.test(R.path([field], data), data)
    )
    return failedRule ? failedRule.error : undefined
  }
  return R.pickBy(Boolean, R.mapObjIndexed(getError, rules))
}

const EmptyBasket = () => <p>Вашата кошница е празна</p>

export const Checkbox = ({
  input,
  label,
  meta: { error, touched, active }
}) => {
  const showValidation = touched || (!!input.value && !active)
  return (
    <label className="row bottom-spacing-m">
      <div className="col-sm-3 col-md-3 text-right">
        <input type="checkbox" {...input} />
      </div>
      <div className="col-sm col-md">
        <div>{label}</div>
        {showValidation && error && (
          <span className="input-error">{error}</span>
        )}
      </div>
    </label>
  )
}

export const TextInput = ({
  input,
  type,
  required,
  meta: { error, touched, active }
}) => {
  const showValidation = touched || (!!input.value && !active)
  return (
    <div>
      <input {...input} className="input" type={type ? type : 'text'} />
      {showValidation && error && <span className="input-error">{error}</span>}
    </div>
  )
}

const TextArea = ({
  input,
  type,
  required,
  meta: { error, touched, active }
}) => {
  const showValidation = touched || (!!input.value && !active)
  return (
    <div>
      <textarea {...input} className="input" />
      {showValidation && error && <span className="input-error">{error}</span>}
    </div>
  )
}

const CheckoutForm = ({ cart, mutationData, checkout }) => (
  <Form
    initialValues={{
      delivery: deliveryMethods.toOffice
    }}
    onSubmit={values => {
      const data = R.map(
        R.assoc('address', {
          city: values.city,
          fullname: `${values.name} ${values.lastname}`,
          address: values.address
        }),
        R.omit(['name', 'lastname', 'terms', 'ageConfirmation'])
      )(values)
      console.log(data)
      checkout({
        variables: data
      })
    }}
    validate={values => validate(values, validationRules)}
    render={({ handleSubmit, form }) => {
      const deliveryMethod = form.getState().values.delivery
      const deliveryPrice = deliveryPrices[deliveryMethod]
      return (
        <div className="row limit-page">
          <div className="col-sm-12 col-md-6">
            <form onSubmit={handleSubmit}>
              <div className="row horizontal-align-center bottom-spacing-m">
                <div className="col-sm-3 col-md-3 text-right">
                  <label>Име</label>
                </div>
                <div className="col-sm col-md">
                  <Field name="name" type="text" component={TextInput} />
                </div>
              </div>
              <div className="row horizontal-align-center bottom-spacing-m">
                <div className="col-sm-3 col-md-3 text-right">
                  <label>Фамилия</label>
                </div>
                <div className="col-sm col-md">
                  <Field name="lastname" component={TextInput} />
                </div>
              </div>
              <div className="row horizontal-align-center bottom-spacing-m">
                <div className="col-sm-3 col-md-3 text-right">
                  <label>Имейл</label>
                </div>
                <div className="col-sm col-md">
                  <Field name="email" type="email" component={TextInput} />
                </div>
              </div>
              <div className="row horizontal-align-center bottom-spacing-m">
                <div className="col-sm-3 col-md-3 text-right">
                  <label>Град</label>
                </div>
                <div className="col-sm col-md">
                  <Field name="city" component={TextInput} />
                </div>
              </div>
              <div className="row horizontal-align-center bottom-spacing-m">
                <div className="col-sm-3 col-md-3 text-right">
                  <label>Телефон</label>
                </div>
                <div className="col-sm col-md">
                  <Field name="telephone" component={TextInput} />
                </div>
              </div>
              <div className="row horizontal-align-center bottom-spacing-m">
                <div className="col-sm-3 col-md-3 text-right">
                  <label>Адрес</label>
                </div>
                <div className="col-sm col-md">
                  <Field name="address" component={TextArea} />
                </div>
              </div>
              <label className="row horizontal-align-center">
                <div className="col-sm-3 col-md-3 text-right">
                  <Field
                    name="delivery"
                    component="input"
                    type="radio"
                    value={deliveryMethods.toOffice}
                  />
                </div>
                <div className="col-sm col-md">
                  До Офис Еконт -{' '}
                  {formatPrice(deliveryPrices[deliveryMethods.toOffice])}
                </div>
              </label>
              <label className="row horizontal-align-center bottom-spacing-m">
                <div className="col-sm-3 col-md-3 text-right">
                  <Field
                    name="delivery"
                    component="input"
                    type="radio"
                    value={deliveryMethods.toAddress}
                  />
                </div>
                <div className="col-sm col-md">
                  До Адрес -{' '}
                  {formatPrice(deliveryPrices[deliveryMethods.toAddress])}
                </div>
              </label>
              <Field
                type="checkbox"
                label={<TermsLabel />}
                name="terms"
                component={Checkbox}
              />
              <Field
                type="checkbox"
                label="Потвърждавам че имам навършени 14 години"
                name="ageConfirmation"
                component={Checkbox}
              />
            </form>
          </div>
          <div className="col-sm-12 col-md-6">
            <CartProductsList products={cart.products} />

            <div className="row bottom-spacing-m">
              <h3>Поръчка</h3>
            </div>
            <div className="row">
              <div className="col-sm-6">
                {cart.quantity} {pluralize('ПРОДУКТ', cart.quantity, '', 'А')}
              </div>
              <div className="col-sm-6 text-right bottom-spacing-s">
                {formatPrice(cart.price)}
              </div>
              <div className="col-sm-6">ДОСТАВКА</div>
              <div className="col-sm-6 text-right">
                {formatPrice(deliveryPrice)}
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 ">
                <div className="devider bottom-spacing-m" />
              </div>
              <div className="col-sm-6 ">ОБЩО</div>
              <div className="col-sm-6 text-right">
                {formatPrice(cart.price + deliveryPrice)}
              </div>
            </div>
            <button
              onClick={e => {
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth'
                })
                handleSubmit(e)
              }}
              className="full-width col-sm-12 button"
              type="button"
            >
              Поръчай
            </button>
          </div>
        </div>
      )
    }}
  />
)

export default props => (
  <Query query={cartQuery}>
    {({ data: { cart, loading } }) => (
      <div className="confined-container">
        {(!cart || (cart && cart.products.length === 0)) && !loading ? (
          <EmptyBasket />
        ) : (
          <Fragment>
            <h3>Доставка</h3>
            <Mutation mutation={Checkout}>
              {(checkout, { data: mutationData }) => (
                <React.Fragment>
                  {mutationData && mutationData.checkout ? (
                    <Redirect to="/checkoutsuccess" />
                  ) : (
                    <CheckoutForm
                      cart={cart}
                      checkout={checkout}
                      mutationData={mutationData}
                    />
                  )}
                </React.Fragment>
              )}
            </Mutation>
          </Fragment>
        )}
      </div>
    )}
  </Query>
)

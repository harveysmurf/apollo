import React, { Fragment } from 'react'
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import { Query, Mutation } from 'react-apollo'
import { cartQuery } from '../../queries/remote'
import { Form, Field } from 'react-final-form'
import { CartProductsList } from '../cart/cart'
import * as R from 'ramda'
import { Checkout } from '../../mutations/remote'
import { pluralize } from '../cart/cart'
import { formatPrice } from '../../localization/price'
import styles from './checkout.scss'
import {
  CityDropdown,
  OfficeDropDown
} from './checkout-dropdown/checkout-dropdown'

const requiredFieldError = 'Задължително поле.'
const REGEX_EMAIL = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
export const deliveryMethods = {
  toAddress: 'toAddress',
  toOffice: 'toOffice'
}
export const deliveryPrices = {
  [deliveryMethods.toAddress]: 7.5,
  [deliveryMethods.toOffice]: 5.5
}

export const getDeliveryPrice = (cartPrice, deliveryMethod) =>
  cartPrice > 60 ? 0 : deliveryPrices[deliveryMethod]

const validationRules = {
  name: [
    {
      test: x => !!x,
      error: requiredFieldError
    }
  ],
  office: [
    {
      test: x => !!x,
      error: 'Моля въведете офис'
    }
  ],
  address: [
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
      error: 'Моля, въведете населено място.'
    }
  ],
  telephone: [
    {
      test: x => !!x,
      error: 'Моля, въведете телефонен номер.'
    }
  ],
  email: [
    {
      test: x => !!x,
      error: requiredFieldError
    },
    {
      test: x => REGEX_EMAIL.test(x),
      error: 'Моля, въведете валиден имейл.'
    }
  ]
}

const TermsLabel = () => (
  <>
    Съгласен съм с <Link to="/terms">Условията за ползване на сайта.</Link>
  </>
)

const validateField = fieldRules => value => {
  const failedRule = fieldRules.find(rule => !rule.test(value))
  return failedRule ? failedRule.error : undefined
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

const CheckoutForm = ({ cart, checkout }) => (
  <Form
    initialValues={{
      delivery: deliveryMethods.toOffice
    }}
    onSubmit={values => {
      const data = R.map(
        R.assoc('delivery', {
          cityId: values.city.id,
          cityName: values.city.name,
          address: values.address,
          method: values.delivery,
          ...(values.office && {
            officeId: values.office.id,
            address: values.office.presentation
          })
        }),
        R.omit(['terms', 'ageConfirmation', 'office', 'city', 'address'])
      )(values)
      checkout({
        variables: data
      })
    }}
    render={({ handleSubmit, form }) => {
      const deliveryMethod = form.getState().values.delivery
      const city = form.getState().values.city
      const deliveryPrice = getDeliveryPrice(cart.price, deliveryMethod)
      const toOffice = deliveryMethod === deliveryMethods.toOffice
      return (
        <div className="row">
          <div className="col-sm-12 col-md-6 col-lg-7">
            <form onSubmit={handleSubmit}>
              <div className={`row ${styles['delivery-section']}`}>
                <div className="col-sm-12 col-md-6 bottom-spacing-s">
                  <label>
                    <Field
                      name="delivery"
                      component="input"
                      type="radio"
                      value={deliveryMethods.toOffice}
                    />
                    <div>
                      До Офис Еконт -{' '}
                      {formatPrice(
                        getDeliveryPrice(cart.price, deliveryMethods.toOffice)
                      )}
                    </div>
                  </label>
                </div>
                <div className="col-sm-12 col-md-6 bottom-spacing-s">
                  <label>
                    <Field
                      name="delivery"
                      component="input"
                      type="radio"
                      value={deliveryMethods.toAddress}
                    />
                    <div>
                      До Адрес -{' '}
                      {formatPrice(
                        getDeliveryPrice(cart.price, deliveryMethods.toAddress)
                      )}
                    </div>
                  </label>
                </div>
              </div>
              <div className="row horizontal-align-center bottom-spacing-m">
                <div className="col-sm-3 col-md-3 text-right">
                  <label>Град</label>
                </div>
                <div className="col-sm col-md">
                  <Field
                    validate={validateField(validationRules.city)}
                    placeholder="Избери Град"
                    name="city"
                    component={CityDropdown}
                    changeField={form.change}
                    withOffices={toOffice}
                  />
                </div>
              </div>
              {toOffice && (
                <div className="row horizontal-align-center bottom-spacing-m">
                  <div className="col-sm-3 col-md-3 text-right">
                    <label>Офис</label>
                  </div>
                  <div className="col-sm col-md">
                    <Field
                      validate={validateField(validationRules.office)}
                      placeholder="Избери Офис"
                      name="office"
                      component={OfficeDropDown}
                      changeField={form.change}
                      city={city}
                    />
                  </div>
                </div>
              )}
              {!toOffice && (
                <div className="row horizontal-align-center bottom-spacing-m">
                  <div className="col-sm-3 col-md-3 text-right">
                    <label>Адрес</label>
                  </div>
                  <div className="col-sm col-md">
                    <Field
                      validate={validateField(validationRules.address)}
                      name="address"
                      type="text"
                      component={TextInput}
                    />
                  </div>
                </div>
              )}
              <div className="row horizontal-align-center bottom-spacing-m">
                <div className="col-sm-3 col-md-3 text-right">
                  <label>Име</label>
                </div>
                <div className="col-sm col-md">
                  <Field
                    validate={validateField(validationRules.name)}
                    name="name"
                    type="text"
                    component={TextInput}
                  />
                </div>
              </div>
              <div className="row horizontal-align-center bottom-spacing-m">
                <div className="col-sm-3 col-md-3 text-right">
                  <label>Фамилия</label>
                </div>
                <div className="col-sm col-md">
                  <Field
                    validate={validateField(validationRules.lastname)}
                    name="lastname"
                    component={TextInput}
                  />
                </div>
              </div>
              <div className="row horizontal-align-center bottom-spacing-m">
                <div className="col-sm-3 col-md-3 text-right">
                  <label>Имейл</label>
                </div>
                <div className="col-sm col-md">
                  <Field
                    validate={validateField(validationRules.email)}
                    name="email"
                    type="email"
                    component={TextInput}
                  />
                </div>
              </div>
              <div className="row horizontal-align-center bottom-spacing-m">
                <div className="col-sm-3 col-md-3 text-right">
                  <label>Телефон</label>
                </div>
                <div className="col-sm col-md">
                  <Field
                    validate={validateField(validationRules.telephone)}
                    name="telephone"
                    component={TextInput}
                  />
                </div>
              </div>
              <Field
                validate={validateField(validationRules.terms)}
                type="checkbox"
                label={<TermsLabel />}
                name="terms"
                component={Checkbox}
              />
              <Field
                validate={validateField(validationRules.ageConfirmation)}
                type="checkbox"
                label="Потвърждавам, че имам навършени 14 години."
                name="ageConfirmation"
                component={Checkbox}
              />
            </form>
          </div>
          <div className="col-sm-12 col-md-6 col-lg-5">
            <CartProductsList products={cart.products} />
            <div className="row bottom-spacing-m">
              <h3 className="col-sm-12">Поръчка</h3>
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

export default () => (
  <Query query={cartQuery}>
    {({ data: { cart, loading } }) => (
      <div className="confined-container">
        {(!cart || (cart && cart.products.length === 0)) && !loading ? (
          <EmptyBasket />
        ) : (
          <Fragment>
            <h3 className="col-sm-12">Доставка</h3>
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

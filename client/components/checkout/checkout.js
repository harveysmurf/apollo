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

const requiredFieldError = 'Задължително поле'
const REGEX_EMAIL = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

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
    onSubmit={values => {
      checkout({
        variables: values
      })
    }}
    validate={values => validate(values, validationRules)}
    render={({ handleSubmit }) => (
      <div className="row limit-page">
        {console.log(mutationData)}
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
                  checked
                  name="delivery"
                  component="input"
                  type="radio"
                  value="0"
                />
              </div>
              <div className="col-sm col-md">До Офис</div>
            </label>
            <label className="row horizontal-align-center bottom-spacing-m">
              <div className="col-sm-3 col-md-3 text-right">
                <Field
                  name="delivery"
                  component="input"
                  type="radio"
                  value="1"
                />
              </div>
              <div className="col-sm col-md">До Адрес</div>
            </label>
            <label className="row horizontal-align-center bottom-spacing-m">
              <div className="col-sm-3 col-md-3 text-right">
                <input type="checkbox" id="sf1-check" />
              </div>
              <div className="col-sm col-md">
                Запознат съм с условията за ползване
              </div>
            </label>
          </form>
        </div>
        <div className="col-sm-12 col-md-6">
          <CartProductsList products={cart.products} />
          <CartSummary hideSubmit cart={cart} />
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
    )}
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

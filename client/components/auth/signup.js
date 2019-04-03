import { Form, Field } from 'react-final-form'
import React from 'react'
import { Mutation } from 'react-apollo'
import { Register } from '../../mutations/remote'
import * as R from 'ramda'
const requiredFieldError = 'Задължително поле'
const REGEX_EMAIL = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

const validationRules = {
  name: [
    {
      test: x => !!x,
      error: requiredFieldError
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

//TODO reuse existing validate
const validate = (data, rules) => {
  const getError = (fieldRules, field) => {
    const failedRule = fieldRules.find(
      rule => !rule.test(R.path([field], data), data)
    )
    return failedRule ? failedRule.error : undefined
  }
  return R.pickBy(Boolean, R.mapObjIndexed(getError, rules))
}

const TextInput = ({
  placeholder,
  input,
  type,
  required,
  meta: { error, touched, active }
}) => {
  const showValidation = touched || (!!input.value && !active)
  return (
    <div>
      <input
        placeholder={placeholder}
        {...input}
        className="input"
        type={type ? type : 'text'}
      />
      {showValidation && error && <span className="input-error">{error}</span>}
    </div>
  )
}
const RegistrationForm = ({ register, registrationData }) => (
  <Form
    onSubmit={values => {
      console.log(values)
      register({
        variables: values
      })
    }}
    validate={values => {
      return validate(values, validationRules)
    }}
    render={({ handleSubmit }) => (
      <div className="row limit-page">
        <div className="col-sm-12 col-md-6">
          <div className="row horizontal-align-center bottom-spacing-m">
            <div className="col-sm col-md">
              <Field
                name="name"
                type="text"
                placeholder="Име"
                component={TextInput}
              />
            </div>
          </div>
          <div className="row horizontal-align-center bottom-spacing-m">
            <div className="col-sm col-md">
              <Field
                name="last_name"
                placeholder="Фамилия"
                component={TextInput}
              />
            </div>
          </div>
          <div className="row horizontal-align-center bottom-spacing-m">
            <div className="col-sm col-md">
              <Field
                name="email"
                placeholder="Имейл"
                type="email"
                component={TextInput}
              />
            </div>
          </div>
          <label className="row horizontal-align-center bottom-spacing-m">
            <div className="col-sm-3 col-md-3 text-right">
              <input type="checkbox" id="sf1-check" />
            </div>
            <div className="col-sm col-md">
              Запознат съм с условията за ползване
            </div>
          </label>
          <button
            onClick={handleSubmit}
            className="full-width col-sm-12 button"
            type="button"
          >
            Регистрирай ме
          </button>
        </div>
      </div>
    )}
  />
)

export default props => (
  <div className="confined-container">
    <React.Fragment>
      <h3>Регистрация</h3>
      <Mutation mutation={Register}>
        {(register, { data: registerData }) => (
          <RegistrationForm mutationData={registerData} register={register} />
        )}
      </Mutation>
    </React.Fragment>
  </div>
)

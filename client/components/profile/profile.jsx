import React from 'react'
import * as R from 'ramda'
import { Query } from 'react-apollo'
import { Form, Field } from 'react-final-form'
import { userQuery } from '../../queries/remote'
import { TextInput } from '../checkout/checkout'

const requiredFieldError = 'Задължително поле'

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
  telephone: [
    {
      test: x => !!x,
      error: 'Моля въведете телефонен номер'
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
export const ProfileForm = ({ profile }) => {
  return (
    <Form
      initialValues={profile}
      onSubmit={values => {
        console.log(values)
      }}
      validate={values => validate(values, validationRules)}
      render={({ handleSubmit }) => (
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
                  <label>Телефон</label>
                </div>
                <div className="col-sm col-md">
                  <Field name="telephone" component={TextInput} />
                </div>
              </div>
            </form>
          </div>
          <div className="col-sm-12 col-md-6">
            <button
              onClick={handleSubmit}
              className="full-width col-sm-12 button"
              type="button"
            >
              Обнови
            </button>
          </div>
        </div>
      )}
    />
  )
}

export default props => (
  <Query query={userQuery}>
    {({ data: { user, loading } }) => (
      <div className="confined-container">
        <ProfileForm profile={user} />
      </div>
    )}
  </Query>
)

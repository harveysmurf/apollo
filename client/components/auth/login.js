import React, { useState } from 'react'
import axios from 'axios'
import styles from './login.scss'
import { Field, Form } from 'react-final-form'
import { TextInput } from '../form'
import { isRequired, REGEX_EMAIL, validateField } from '../../utils/validation'
import { Link } from 'react-router-dom'
import { FORM_ERROR } from 'final-form'
import { useMutation } from '@apollo/client'
import { Login } from '../../mutations/remote'

const validationRules = {
  email: [
    {
      test: isRequired,
      error: 'Моля въведете имейл'
    },
    {
      test: x => REGEX_EMAIL.test(x),
      error: 'Моля, въведете валиден имейл.'
    }
  ],
  password: [
    {
      test: isRequired,
      error: 'Моля въведете парола'
    }
  ]
}

const LoginComponent = () => {
  const [login, { loading }] = useMutation(Login)
  return (
    <Form
      onSubmit={values =>
        login({
          variables: {
            email: values.email,
            password: values.password
          }
        })
          .then(({ data: { login: { user, errors } } }) => {
            if (user) {
              window.location = '/'
            } else if (errors) {
              const transformedErrors = errors.reduce(
                (finalFormErrors, { field, message }) => {
                  const fieldName = field === 'general' ? FORM_ERROR : field
                  finalFormErrors[fieldName] = message
                  return finalFormErrors
                },
                {}
              )
              console.log(transformedErrors)
              return transformedErrors
            }
          })
          .catch(() => ({ FORM_ERROR: 'Грешка, моля опитайте отново' }))
      }
      render={({ handleSubmit, submitError }) => (
        <div className={`${styles['login']} bottom-spacing-xl`}>
          <h1 className="bottom-spacing-xl">Вход</h1>
          {submitError && <span className="input-error">{submitError}</span>}
          <fieldset>
            <div className="row horizontal-align-center bottom-spacing-m">
              <div className="col-sm col-md">
                <Link to="/forgotten-password">Забравена парола</Link>
              </div>
            </div>
            <div className="row horizontal-align-center bottom-spacing-m">
              <div className="col-sm col-md">
                <Field
                  validate={validateField(validationRules.email)}
                  component={TextInput}
                  name="email"
                  placeholder="имейл"
                />
              </div>
            </div>
            <div className="row horizontal-align-center bottom-spacing-m">
              <div className="col-sm col-md">
                <Field
                  validate={validateField(validationRules.password)}
                  component={TextInput}
                  type="password"
                  name="password"
                  placeholder="парола"
                />
              </div>
            </div>
            <div className="row horizontal-align-center">
              <button
                onClick={handleSubmit}
                className="button primary col-sm-12"
                disabled={loading}
              >
                Вписване
              </button>
            </div>
          </fieldset>
        </div>
      )}
    />
  )
}

export default LoginComponent

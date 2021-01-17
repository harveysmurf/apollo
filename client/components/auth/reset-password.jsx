import { useMutation } from '@apollo/client'
import { FORM_ERROR } from 'final-form'
import React, { useState } from 'react'
import { Field, Form } from 'react-final-form'
import { Link } from 'react-router-dom'
import { UpdatePassword } from '../../mutations/remote'
import { isRequired, validateField } from '../../utils/validation'
import { TextInput } from '../form'
import styles from './login.scss'

const validationRules = [
  {
    test: isRequired,
    error: 'Моля въведете вашата нова парола'
  }
]

const SuccessfulReset = () => (
  <div className={`${styles['login']} bottom-spacing-xl`}>
    <p>
      Вашата парола беше успешно обновена. <Link to="/login">Вход</Link>
    </p>
  </div>
)

const ResetPasswordPage = ({
  match: {
    params: { resetPassToken }
  }
}) => {
  const [successfulReset, setSuccessfulReset] = useState(false)
  const [updatePassword, { loading }] = useMutation(UpdatePassword)
  return successfulReset ? (
    <SuccessfulReset />
  ) : (
    <Form
      onSubmit={async values => {
        try {
          const result = await updatePassword({
            variables: {
              token: resetPassToken,
              password: values.password
            }
          })
          if (result.data.updatePassword.success !== true) {
            return { [FORM_ERROR]: 'failed' }
          } else {
            setSuccessfulReset(true)
          }
        } catch (error) {
          console.log(error)
          return { [FORM_ERROR]: 'failed' }
        }
      }}
      render={({ handleSubmit, submitError }) => {
        return (
          <div className={styles['login']}>
            <h1 className="bottom-spacing-xl">Забравена парола</h1>
            {submitError && (
              <span className="input-error">
                Неуспешно обновяване на паролата
              </span>
            )}
            <fieldset>
              <div className="row horizontal-align-center bottom-spacing-m">
                <div className="col-sm col-md">
                  <Field
                    validate={validateField(validationRules)}
                    component={TextInput}
                    name="password"
                    type="password"
                    placeholder="нова парола"
                  />
                </div>
              </div>
              <div className="row horizontal-align-center">
                <button
                  onClick={handleSubmit}
                  className="button primary col-sm-12"
                  disabled={loading}
                >
                  Обнови паролата
                </button>
              </div>
            </fieldset>
          </div>
        )
      }}
    />
  )
}

export default ResetPasswordPage

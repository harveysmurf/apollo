import { useMutation } from '@apollo/client'
import { FORM_ERROR } from 'final-form'
import React, { useState } from 'react'
import { Field, Form } from 'react-final-form'
import { ResetPassword } from '../../mutations/remote'
import { isRequired, REGEX_EMAIL, validateField } from '../../utils/validation'
import { TextInput } from '../form'
import styles from './login.scss'

const emailValidationRules = [
  {
    test: isRequired,
    error: 'Моля въведете имейл'
  },
  {
    test: x => REGEX_EMAIL.test(x),
    error: 'Моля, въведете валиден имейл.'
  }
]

const MailSentCallout = ({ email }) => (
  <div className={`${styles['login']} bottom-spacing-xl`}>
    <h4>Писмо с инструкция за възстановяване на парола беше изпратено на Вашата електронна поща ({email}).</h4>
  </div>
)
const ForgottenPasswordPage = () => {
  const [mailSent, setMailSent] = useState()
  const [resetPassword] = useMutation(ResetPassword)
  return mailSent ? (
    <MailSentCallout email={mailSent} />
  ) : (
    <Form
      onSubmit={async ({ email }) => {
        try {
          const {
            data: { resetPassword: resetPasswordResponse }
          } = await resetPassword({
            variables: {
              email
            }
          })
          if (!resetPasswordResponse) {
            return { [FORM_ERROR]: 'Грешка, моля опитайте отново' }
          }
          setMailSent(email)
        } catch (error) {
          return { [FORM_ERROR]: 'Грешка, моля опитайте отново' }
        }
      }}
      render={({ handleSubmit, submitError }) => (
        <div className={`${styles['login']} bottom-spacing-xl`}>
          <h1 className="bottom-spacing-xl">Забравена парола</h1>
          {submitError && (
            <span className="input-error">Грешка, моля опитайте отново</span>
          )}
          <fieldset>
            <div className="row horizontal-align-center bottom-spacing-m">
              <div className="col-sm col-md">
                <p>
                  Въведете вашият имейл адрес. Ако профилът съществува, ще
                  получите имейл за промяна на паролата.
                </p>
              </div>
            </div>
            <div className="row horizontal-align-center bottom-spacing-m">
              <div className="col-sm col-md">
                <Field
                  validate={validateField(emailValidationRules)}
                  component={TextInput}
                  name="email"
                  placeholder="имейл"
                />
              </div>
            </div>
            <div className="row horizontal-align-center">
              <button
                onClick={handleSubmit}
                className="button primary col-sm-12"
              >
                Изпрати имейл
              </button>
            </div>
          </fieldset>
        </div>
      )}
    />
  )
}
export default ForgottenPasswordPage

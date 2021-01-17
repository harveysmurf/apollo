import React from 'react'
import styles from './text-input.scss'

const TextInput = ({
  input,
  placeholder,
  type,
  meta: { error, touched, active }
}) => {
  const showValidation = touched || (!!input.value && !active)
  const hasValidationError = showValidation && error
  return (
    <div className={styles['input-group']}>
      <input
        {...input}
        placeholder={placeholder}
        className="input"
        type={type ? type : 'text'}
      />
      <span className="input-error">{hasValidationError ? error : ' '}</span>
    </div>
  )
}

export default TextInput

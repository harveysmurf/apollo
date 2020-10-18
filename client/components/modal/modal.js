import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import styles from './modal.scss'

export default ({ onCloseInitiated }) => {
  const handleKeyDown = event => {
    if (event.key === 'Escape') {
      onCloseInitiated()
    }
  }
  useEffect(
    () => {
      document.addEventListener('keydown', handleKeyDown)
      document.body.classList.add('modal-open')
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.body.classList.remove('modal-open')
      }
    },
    [handleKeyDown]
  )

  const { children, className } = this.props
  const classes = [className, styles['modal']].filter(Boolean)
  const content = <div className={[...classes]}>{children}</div>
  return ReactDOM.createPortal(content, document.getElementById('modal-root'))
}

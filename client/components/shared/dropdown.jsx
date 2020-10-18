import React, { useState } from 'react'
import styles from './dropdown.scss'

export const Dropdown = ({ children, label, className = '' }) => {
  const [isOpen, setIsOpen] = useState(true)
  const toggleIsOpen = () => setIsOpen(!isOpen)
  return (
    <div
      className={`${styles['dropdown']} ${className}`}
      onClick={toggleIsOpen}
    >
      {label}
      <div
        data-role="dropdown"
        className={`${styles['dropdown-content']} ${
          isOpen ? styles['open'] : ''
        }`}
      >
        {children}
      </div>
    </div>
  )
}

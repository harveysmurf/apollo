import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './magic-dropdown.scss'
import DropdownModal from '../../dropdown-modal/dropdown-modal'
import { useScreenSize } from '../../../hooks'

export default ({
  placeholder,
  onSelect,
  renderDropDownItem,
  list,
  label,
  open,
  setOpen,
  onSearchChange,
  disabled,
  loading
}) => {
  const toggleOpen = () => setOpen(!open)
  const { isMobile } = useScreenSize()
  const renderDropDownList = list.map((value, index) => (
    <div
      className={styles['dropdown-item']}
      key={[value.id, index].join('-')}
      onClick={() => {
        onSelect(value)
        setOpen(false)
      }}
    >
      {renderDropDownItem(value)}
    </div>
  ))
  return (
    <>
      <button
        disabled={disabled}
        type="button"
        onClick={toggleOpen}
        className="button primary"
      >
        {label}
        <FontAwesomeIcon icon="caret-down" />
      </button>
      {isMobile
        ? open && (
            <DropdownModal onClose={() => setOpen(false)}>
              <div className={styles['modal-autocomplete-input']}>
                <div
                  onClick={() => setOpen(false)}
                  className={styles['back-button']}
                >
                  <FontAwesomeIcon icon={['fas', 'arrow-left']} size="lg" />
                </div>
                <Simple
                  onChange={onSearchChange}
                  autoFocus
                  className={styles['borderless-input']}
                  placeholder={placeholder}
                />
              </div>
              <div className={styles['mobile-dropdown']}>
                {renderDropDownList}
              </div>
            </DropdownModal>
          )
        : open && (
            <div className={styles['desktop-dropdown']}>
              <Simple placeholder={placeholder} onChange={onSearchChange} />
              <div className={loading ? styles['loading'] : ''}>
                {renderDropDownList}
              </div>
            </div>
          )}
    </>
  )
}

const Simple = ({ placeholder, onChange, className }) => {
  const [search, setSearch] = useState('')
  return (
    <input
      className={className}
      value={search}
      onChange={({ target: { value } }) => {
        setSearch(value)
        onChange(value)
      }}
      autoFocus
      placeholder={placeholder}
    />
  )
}

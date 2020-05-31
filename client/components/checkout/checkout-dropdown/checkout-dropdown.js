import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import MagicDropdown from '../magic-dropdown/magic-dropdown'
import { getCities, getOffices } from '../../../queries/remote'
// Hook

const throttle = (func, limit) => {
  let lastFunc
  let lastRan
  return function() {
    const context = this
    const args = arguments
    if (!lastRan) {
      func.apply(context, args)
      lastRan = Date.now()
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(function() {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args)
          lastRan = Date.now()
        }
      }, limit - (Date.now() - lastRan))
    }
  }
}
export const CityDropdown = ({
  input,
  changeField,
  placeholder,
  withOffices,
  meta: { error, touched, active }
}) => {
  // const debouncedSearch = useDebounce(search, 200)
  const [open, setOpen] = useState(false)

  const { loading, data, refetch } = useQuery(getCities, {
    variables: {
      ...(withOffices && { withOffices })
    }
  })

  const cities = (data && data.getCities) || []
  const currentCity = cities.find(c => c.id === input.value.id)
  const cityName = currentCity && currentCity.name
  const showValidation = touched || (!!input.value.id && !active)
  return (
    <>
      <MagicDropdown
        loading={loading}
        open={open}
        setOpen={setOpen}
        label={cityName || placeholder}
        list={cities}
        placeholder={cityName || placeholder}
        onSelect={city => {
          if (!currentCity || currentCity.id !== city.id) {
            changeField(input.name, city)
            changeField('office', null)
          }
        }}
        renderDropDownItem={city => city.presentation}
        onSearchChange={throttle(value => {
          if (!value) {
            refetch()
          } else {
            refetch({
              search: value
            })
          }
        }, 1000)}
      />
      {showValidation && error && (
        <div>
          <span className="input-error">{error}</span>
        </div>
      )}
    </>
  )
}
const includesCaseInsensitive = (string = '', searchString = '') =>
  string.toLowerCase().includes(searchString.toLowerCase())

export const OfficeDropDown = ({
  input,
  changeField,
  placeholder,
  meta: { error, touched, active },
  city
}) => {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const offices = (city && city.offices) || []
  const currentOffice = input.value

  const officeName = currentOffice && currentOffice.name
  const showValidation = touched || (!!input.value && !active)
  return (
    <>
      <MagicDropdown
        open={open}
        setOpen={setOpen}
        disabled={!city}
        label={officeName || placeholder}
        list={
          search === ''
            ? offices
            : offices.filter(o =>
                includesCaseInsensitive(o.presentation, search)
              )
        }
        placeholder={officeName || placeholder}
        onSelect={office => {
          setSearch('')
          changeField(input.name, office)
        }}
        renderDropDownItem={office => office.presentation}
        search={search}
        onSearchChange={setSearch}
      />
      {showValidation && error && (
        <div>
          <span className="input-error">{error}</span>
        </div>
      )}
    </>
  )
}

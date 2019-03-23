import React from 'react'
import * as R from 'ramda'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
const BreadCrumb = ({ name, separator, href }) => (
  <React.Fragment>
    <Link to={href}>{name}</Link>
    {separator && '/'}
  </React.Fragment>
)
const homeBreadCrumb = {
  href: '/',
  name: <FontAwesomeIcon icon="home" />
}

const prependIf = booly => val => {
  if (booly) {
    return R.prepend(homeBreadCrumb)(val)
  } else {
    return val
  }
}
const createBreadCrumbs = (breadcrumbs, home = true) => {
  const mapIndexed = R.addIndex(R.map)
  const teste = R.pipe(
    prependIf(home),
    mapIndexed((breadcrumb, i, breadcrumbs) =>
      R.assoc('separator', i !== breadcrumbs.length - 1, breadcrumb)
    )
  )(breadcrumbs)

  console.log(teste)
  return teste
}

export const Breadcrumbs = ({ breadcrumbs, home }) => (
  <React.Fragment>
    <BreadCrumb name="Home" separator href="/" />
    {createBreadCrumbs(breadcrumbs).map((breadcrumb, key) => (
      <BreadCrumb key={key} breadcrumb={breadcrumb} />
    ))}
  </React.Fragment>
)

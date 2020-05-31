import React from 'react'
import * as R from 'ramda'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './breadcrumbs.scss'
const BreadCrumb = ({ breadcrumb: { name, href } }) => (
  <li className="capitalize">
    <Link to={href}>{name}</Link>
  </li>
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
  const teste = R.pipe(
    prependIf(home),
    R.ifElse(x => x.length > 1, R.identity, () => [])
  )(breadcrumbs)
  return teste
}

export const Breadcrumbs = ({ breadcrumbs }) => (
  <ul className={styles.breadcrumbs}>
    {createBreadCrumbs(breadcrumbs).map((breadcrumb, key) => {
      return <BreadCrumb key={key} breadcrumb={breadcrumb} />
    })}
  </ul>
)

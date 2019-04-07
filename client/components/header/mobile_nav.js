import React, { Component } from 'react'
import { Link } from 'react-router-dom'

const MobileNav = props => {
  return (
    <div className="mobile-nav text-center">
      <Link to="/" className="mobile-nav-link">
        <div>
          <i className="fa fa-home" aria-hidden="true" />
        </div>
        Начало
      </Link>
      <Link to="/damski-chanti" className="mobile-nav-link">
        <div>
          <i className="fa fa-shopping-bag" aria-hidden="true" />
        </div>
        Продукти
      </Link>
      <Link to="/damski-chanti" className="mobile-nav-link">
        <div>
          <i className="fa fa-user" aria-hidden="true" />
        </div>
        Профил
      </Link>
      <Link to="/" className="mobile-nav-link">
        <div>
          <i className="fa fa-heart" aria-hidden="true" />
        </div>
        Любими
      </Link>
      <Link to="/cart" className="mobile-nav-link">
        <div>
          <i className="fa fa-shopping-cart" aria-hidden="true" />
        </div>
        Количка
      </Link>
    </div>
  )
}

export default MobileNav

import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { userQuery, cartQuery } from '../../queries/remote'
import { useQuery } from '@apollo/client'

const MobileNav = () => {
  const { data, loading } = useQuery(userQuery)
  const user = !loading && data && data.loggedInUser

  const { data: cartData, loading: cartLoading } = useQuery(cartQuery, {
    ssr: false
  })
  const quantity = (!cartLoading && cartData && cartData.cart.quantity) || 0

  return (
    <div className="mobile-nav text-center">
      <Link to="/" className="mobile-nav-link">
        <div>
          <FontAwesomeIcon icon="home" />
        </div>
        Начало
      </Link>
      <Link to="/damski-chanti" className="mobile-nav-link">
        <div>
          <FontAwesomeIcon icon="shopping-bag" />
        </div>
        Продукти
      </Link>
      <Link to="/">
        <img src="/images/log_white.png" />
      </Link>
      {user && (
        <Link to="/damski-chanti" className="mobile-nav-link">
          <div>
            <FontAwesomeIcon icon="user" />
            Профил
          </div>
        </Link>
      )}
      <Link to="/" className="mobile-nav-link">
        <div>
          <FontAwesomeIcon icon="heart" />
        </div>
        Любими
      </Link>
      <Link to="/checkout" className="mobile-nav-link">
        <div>
          <div value={quantity} className={quantity ? 'cart-badge' : null}>
            <FontAwesomeIcon icon="shopping-cart" value="5" />
          </div>
        </div>
        Количка
      </Link>
    </div>
  )
}

export default MobileNav

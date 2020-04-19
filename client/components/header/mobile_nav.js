import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { userQuery } from '../../queries/remote'
import { Query } from 'react-apollo'

const MobileNav = () => {
  return (
    <Query query={userQuery}>
      {props => {
        const user = props.data.loggedInUser
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
                <FontAwesomeIcon icon="shopping-cart" />
              </div>
              Количка
            </Link>
          </div>
        )
      }}
    </Query>
  )
}

export default MobileNav

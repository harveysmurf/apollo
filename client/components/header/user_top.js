import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import Dropdown from '../utilities/dropdown'
import { userQuery } from '../../queries/remote'

const UserTop = props => {
  if (props.loading) return <div>Loading...</div>

  const user = props.data.loggedInUser
  return (
    <div>
      <Dropdown
        className="user-link"
        button_content={
          <div>
            <FontAwesomeIcon icon="phone" />
            <span>За връзка</span>
          </div>
        }
        dropdown_data={
          <div>
            <div>0987 23 34 32</div>
            <div>2323 34 32 23</div>
          </div>
        }
      />
      {!user && (
        <Link to="/register" className="user-link">
          <FontAwesomeIcon icon="user-plus" />
          Регистрация
        </Link>
      )}
      {!user && (
        <Link to="/login" className="user-link">
          <FontAwesomeIcon icon="sign-in-alt" />
          Вход
        </Link>
      )}
      {user && (
        <Link to="/profile" className="user-link">
          <FontAwesomeIcon icon="user" />
          <span>Профил</span>
        </Link>
      )}

      {user && (
        <a href="#" className="favorites user-link">
          <FontAwesomeIcon icon="heart" />
          Любими
        </a>
      )}
      <Link to="/checkout" className="top-cart user-link">
        <FontAwesomeIcon icon="shopping-cart" />
        Количка
      </Link>
      {user && (
        <Link to="/logout" className="favorites user-link">
          <FontAwesomeIcon icon="sign-out-alt" />
          Изход
        </Link>
      )}
    </div>
  )
}

export default props => (
  <Query query={userQuery} {...props}>
    {UserTop}
  </Query>
)

import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
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
            <i className="fa fa-phone" aria-hidden="true" />
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
          <i className="fa fa-user-plus" aria-hidden="true" />
          Регистрация
        </Link>
      )}
      {!user && (
        <Link to="/login" className="user-link">
          <i className="fa fa-sign-in" aria-hidden="true" />
          Вход
        </Link>
      )}
      {user && (
        <a href="#" className="user-link">
          <i className="fa fa-user" aria-hidden="true" />
          <span>Профил</span>
        </a>
      )}

      {user && (
        <a href="#" className="favorites user-link">
          <i className="fa fa-heart" aria-hidden="true" />
          Любими
        </a>
      )}
      <a href="/cart" className="top-cart user-link">
        <i className="fas fa-shopping-cart" aria-hidden="true" />
        Количка
      </a>
      {user && (
        <a href="#" className="favorites user-link">
          <i className="fas fa-sign-out-alt" />
          Изход
        </a>
      )}
    </div>
  )
}

export default props => (
  <Query query={userQuery} {...props}>
    {UserTop}
  </Query>
)
